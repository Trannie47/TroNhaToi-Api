import { Injectable, NotFoundException } from '@nestjs/common';
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











  async findOne(id: string) {
    const item = await this.prisma.hopDong.findFirst({
      where: { hopDongId: id, isDelete: false },
      //include: { nguoiThue: true, phong: { include: { loaiPhong: true } }, hoaDonPhong: true },
    });
    if (!item) throw new NotFoundException(`HopDong với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreateHopDongDto) {
    return this.prisma.hopDong.create({
      data: { hopDongId: generateId('HD', 11), ...dto } as any,
    });
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
