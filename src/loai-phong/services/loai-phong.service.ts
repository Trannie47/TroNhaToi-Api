import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoaiPhongDto } from '../dto/create-loai-phong.dto';
import { UpdateLoaiPhongDto } from '../dto/update-loai-phong.dto';

@Injectable()
export class LoaiPhongService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.loaiPhong.findMany({
     where: { isDelete: false },//isdelete là lấy những loại phòng chưa xóa
    });
  }
  async create(dto: CreateLoaiPhongDto) {
    //Kiểm tra xem tên loại phòng này đã tồn tại chưa (tránh trùng tên)
    const loaiPhongTrung = await this.prisma.loaiPhong.findFirst({
      where: {
        tenLoaiPhong: dto.tenLoaiPhong.trim(),
         isDelete: false, 
      },
    });

    if (loaiPhongTrung) {
      throw new BadRequestException(`Loại phòng với tên "${dto.tenLoaiPhong}" đã tồn tại trên hệ thống!`);
    }

    try {
      const newLoaiPhong = await this.prisma.loaiPhong.create({
        data: {
          tenLoaiPhong: dto.tenLoaiPhong.trim(),
          dienTich: dto.dienTich,
          soNguoiToiDa: dto.soNguoiToiDa,
          isMayLanh: dto.isMayLanh,
          giaTien: dto.giaTien,
          // maLoaiPhong tự tăng nên không cần truyền vào 
        },
      });

      return {
        success: true,
        message: 'Thêm mới loại phòng thành công!',
        data: newLoaiPhong,
      };
    } catch (error) {
      console.error('Lỗi hệ thống khi thêm loại phòng:', error);
      throw new InternalServerErrorException('Không thể thêm loại phòng do lỗi hệ thống');
    }
  }


  //-------------------------------

  async findOne(id: number) {
    const item = await this.prisma.loaiPhong.findUnique({
      where: { maLoaiPhong: id },
      include: { phong: { select: { phongId: true, tenPhong: true, trangThai: true } } },
    });
    if (!item) throw new NotFoundException(`LoaiPhong với id ${id} không tồn tại`);
    return item;
  }

  

  async update(id: number, dto: UpdateLoaiPhongDto) {
    await this.findOne(id);
    return this.prisma.loaiPhong.update({ where: { maLoaiPhong: id }, data: dto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.loaiPhong.delete({ where: { maLoaiPhong: id } });
  }
}
