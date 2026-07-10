import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHopDongDto } from '../dto/create-hop-dong.dto';
import { UpdateHopDongDto } from '../dto/update-hop-dong.dto';
import { SearchHopDongDto } from '../dto/search-hop-dong.dto';
import { generateId } from '../../common/utils/generate-id.util';

@Injectable()
export class HopDongService {
  constructor(private prisma: PrismaService) {}
  //Lấy ds  hợp đồng 
  findAll() {
    return this.prisma.hopDong.findMany({
      where: {isDelete: false},
      include: { 
        phong: { 
          select:{
            tenPhong: true,
          }
         },
         nguoithue: {
          select:{
            hoTen: true,
          }
         }
      },
      orderBy: {
        ngayKy: 'desc',
      },
    });
  }
  //Lấy danh sách phòng available cho việc tạo hợp đồng
  // (bao gồm phòng chưa có hợp đồng và phòng đã có hợp đồng nhưng mà số lượng nhỏ hơn mức cho phép)
  async getRoomsAvailableForContract() {
    const rooms= await this.prisma.phong.findMany({
      where: {
        isDelete: false,
      },
      include: {
        loaiPhong: true,
        HopDong: {
          where: {
            isDelete: false,
            trangThai: 1
          },
        }
      }
    }) ;
    return rooms.filter(phong=> {
      const soLuongHopDong = phong.HopDong.length;
      const soLuongToiDa = phong.loaiPhong?.soNguoiToiDa;
      return soLuongHopDong ==0 || soLuongHopDong < soLuongToiDa;
    }).map(phong=> ({
      id: phong.phongId,
      tenPhong: phong.tenPhong,
      giaPhongGoc: phong.loaiPhong.giaTien, // khi chọn phòng để tạo hợp đồng thì app sẽ điền luôn giá của phòng đó lên ô giá phòng
    }))
  }

  async create(dto: CreateHopDongDto, listUrlImage: string[]) {
    // Lấy thông tin phòng để lấy tên phòng làm id hợp đồng
    const infoPhong = await this.prisma.phong.findUnique({
      where: { phongId: dto.phongId },
    });

    if (!infoPhong) {
      throw new BadRequestException('Không tìm thấy phòng thuê hợp lệ để lập hợp đồng.');
    }

    // Đếm số lượng hợp đồng cũ của riêng phòng này để lấy làm số đuôi của mã hợp đồng
    const countHopDongCuaPhong = await this.prisma.hopDong.count({
      where: { phongId: dto.phongId },
    });
    const soThuTuNext = countHopDongCuaPhong + 1; 

    // dùng transaction để đảm bảo tính toàn vẹn dữ liệu, nếu có lỗi thì nó tự rollback
    return this.prisma.$transaction(async (prisma) => {
      try {
        const homNay = new Date();
        homNay.setHours(0, 0, 0, 0);
        
        const ngayKy = dto.ngayKy ? new Date(dto.ngayKy) : new Date();
        ngayKy.setHours(0, 0, 0, 0);

        let trangThaiPhong = 0; // Mặc định là 0 (Khởi tạo
        if (ngayKy <= homNay) {
          trangThaiPhong = 1; // Nếu ngày ký <= hôm nay thì trạng thái là 1 (Đang hiệu lực)
        }

        const chuoiImageConTract = listUrlImage.length > 0 ? listUrlImage.join(',') : ''; 

        //Mã hợp đồng: NamThangTenPhongSoThuTu
        const nam = ngayKy.getFullYear();
        const thang = String(ngayKy.getMonth() + 1).padStart(2, '0');
        const maHopDongFormat = `${nam}${thang}${infoPhong.phongId}${soThuTuNext}`;

        const newHopDong = await prisma.hopDong.create({
          data: {
            hopDongId: maHopDongFormat,
            idnt: dto.idnt,
            phongId: dto.phongId,
            ngayKy: dto.ngayKy ? new Date(dto.ngayKy) : new Date(),
            ngayHetHan: dto.ngayHetHan ? new Date(dto.ngayHetHan) : new Date(),
            tienCoc: dto.tienCoc ?? 0,
            giaPhongThucTe: dto.giaPhongThucTe ?? 0,
            trangThai: trangThaiPhong,
            ghiChu: dto.ghiChu ?? '',
            anhHopDong: chuoiImageConTract 
          },
        });

        // Khi phòng có hợp đồng thì cập nhật lại trạng thái đang thuê
        if (trangThaiPhong === 1) {
          await prisma.phong.update({
            where: { phongId: dto.phongId },
            data: { trangThai: 1 }, 
          });

          // Cập nhật trạng thái người thuê sang Đang hoạt động 
          await prisma.nguoiThue.update({
            where: { idnt: dto.idnt },
            data: { trangThai: 1 },
          });
        }

        return {
          success: true,
          message: trangThaiPhong === 1 
            ? 'Tạo mới và kích hoạt hợp đồng thành công!' 
            : 'Tạo hợp đồng chờ hiệu lực thành công!',
          data: newHopDong,
        };

      } catch (error) {
        console.error('Lỗi hệ thống khi xử lý lưu hợp đồng:', error);
        throw new InternalServerErrorException('Không thể hoàn tất lưu hợp đồng do lỗi hệ thống');
      }
    });
  }











  async findOne(id: string) {
    const item = await this.prisma.hopDong.findFirst({
      where: { hopDongId: id, isDelete: false },
      //include: { nguoiThue: true, phong: { include: { loaiPhong: true } }, hoaDonPhong: true },
    });
    if (!item) throw new NotFoundException(`HopDong với id ${id} không tồn tại`);
    return item;
  }

  async update(id: string, dto: UpdateHopDongDto) {
    await this.findOne(id);
    return this.prisma.hopDong.update({ where: { hopDongId: id }, data: dto as any });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.hopDong.update({ where: { hopDongId: id }, data: { isDelete: true } });
  }
  async search(req: SearchHopDongDto) {
    const { ma, limit = 10, offset = 0, sortBy = 'hopDongId', sort = 'desc' } = req;
    const where: any = { isDelete: false };

    if (ma) {
      where.hopDongId = { contains: ma };
    }

    const [data, total] = await Promise.all([
      this.prisma.hopDong.findMany({
        where,
        orderBy: { [sortBy]: sort },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.prisma.hopDong.count({ where }),
    ]);

    return { total, data };
  }

  getAllLoadingBalance(id?: string) {
    return this.prisma.hopDong.findMany({
      where: { isDelete: false },
      orderBy: { hopDongId: 'asc' },
      take: 15,
      ...(id !== undefined && id !== null
        ? { skip: 1, cursor: { hopDongId: id } }
        : {}),
    });
  }

}
