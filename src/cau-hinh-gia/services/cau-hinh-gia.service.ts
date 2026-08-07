import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCauHinhGiaDto } from '../dto/create-cau-hinh-gia.dto';

@Injectable()
export class CauHinhGiaService {
  constructor(private readonly prisma: PrismaService) {}

  async getGiaHienTai() {
    const gia = await this.prisma.cauHinhGia.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!gia) {
      return {
        id: 0,
        giaDien: 0,
        giaNuoc: 0,
        giaXeMay: 0,
        giaXeHoi: 0,
        giaXeDap: 0,
        updatedAt: new Date(),
      };
    }

    return gia;
  }

  async updateGia(dto: CreateCauHinhGiaDto) {
    const hienTai = await this.prisma.cauHinhGia.findFirst({
      orderBy: { id: 'desc' },
    });

    const data = {
      giaDien: dto.giaDien,
      giaNuoc: dto.giaNuoc,
      giaXeMay: dto.giaXeMay ?? hienTai?.giaXeMay ?? null,
      giaXeHoi: dto.giaXeHoi ?? hienTai?.giaXeHoi ?? null,
      giaXeDap: dto.giaXeDap ?? hienTai?.giaXeDap ?? null,
    };

    if (hienTai) {
      return this.prisma.cauHinhGia.update({
        where: { id: hienTai.id },
        data,
      });
    }

    return this.prisma.cauHinhGia.create({ data });
  }

  async getGiaXeTheoLoai(loaiXe: number) {
    const gia = await this.getGiaHienTai();

    const giaTheoLoai: Record<number, number> = {
      0: gia.giaXeMay ?? 0,
      1: gia.giaXeHoi ?? 0,
      2: gia.giaXeDap ?? 0,
    };

    if (!(loaiXe in giaTheoLoai)) {
      throw new BadRequestException(
        'Loại xe không hợp lệ (0: Xe máy, 1: Ô tô, 2: Xe đạp)',
      );
    }

    return { loaiXe, giaMacDinh: giaTheoLoai[loaiXe] };
  }
}