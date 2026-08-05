import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertCauHinhGiaXeDto } from '../dto/upsert-cau-hinh-gia-xe.dto';

@Injectable()
export class CauHinhGiaXeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDanhSachGia() {
    return this.prisma.cauHinhGiaXe.findMany({
      orderBy: { loaiXe: 'asc' },
    });
  }

  async getGiaTheoLoaiXe(loaiXe: number) {
    const gia = await this.prisma.cauHinhGiaXe.findUnique({
      where: { loaiXe },
    });

    if (!gia) {
      return {
        id: 0,
        loaiXe,
        tenLoaiXe: null,
        giaMacDinh: 0,
        updatedAt: new Date(),
      };
    }

    return gia;
  }

  async updateGia(dto: UpsertCauHinhGiaXeDto) {
    return this.prisma.cauHinhGiaXe.upsert({
      where: { loaiXe: dto.loaiXe },
      update: {
        tenLoaiXe: dto.tenLoaiXe,
        giaMacDinh: dto.giaMacDinh,
      },
      create: {
        loaiXe: dto.loaiXe,
        tenLoaiXe: dto.tenLoaiXe,
        giaMacDinh: dto.giaMacDinh,
      },
    });
  }
}
