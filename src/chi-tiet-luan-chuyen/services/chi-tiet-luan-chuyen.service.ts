import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { CreateChiTietLuanChuyenDto } from '../dto/create-chi-tiet-luan-chuyen.dto';
import { UpdateChiTietLuanChuyenDto } from '../dto/update-chi-tiet-luan-chuyen.dto';

@Injectable()
export class ChiTietLuanChuyenService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshot: ThongKeSnapshotService,
  ) {}

  async create(dto: CreateChiTietLuanChuyenDto) {
    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.chiTietLuanChuyen.create({
        data: {
          ...dto,
          ngayLuanChuyen: dto.ngayLuanChuyen ? new Date(dto.ngayLuanChuyen) : undefined,
        },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Tạo chi tiết luân chuyển thành công!',
        data: created,
      };
    });
  }

  async findAll() {
    const list = await this.prisma.chiTietLuanChuyen.findMany({
      where: { isDelete: false },
      include: { suCo: true, hopDong: true, phongMoi: true },
      orderBy: { chiTietLuanChuyenID: 'desc' },
    });

    return { success: true, data: list };
  }

  async findOne(id: number) {
    const item = await this.prisma.chiTietLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
      include: { suCo: true, hopDong: true, phongMoi: true },
    });

    if (!item) throw new NotFoundException(`Không tìm thấy chi tiết luân chuyển #${id}`);

    return { success: true, data: item };
  }

  findBySuCo(suCoId: number) {
    return this.prisma.chiTietLuanChuyen.findMany({
      where: { suCoId, isDelete: false },
      include: { phongMoi: true },
    });
  }

  async update(id: number, dto: UpdateChiTietLuanChuyenDto) {
    const existing = await this.prisma.chiTietLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy chi tiết luân chuyển #${id}`);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.chiTietLuanChuyen.update({
        where: { chiTietLuanChuyenID: id },
        data: {
          ...dto,
          ngayLuanChuyen: dto.ngayLuanChuyen ? new Date(dto.ngayLuanChuyen) : undefined,
        },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Cập nhật chi tiết luân chuyển thành công!',
        data: updated,
      };
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.chiTietLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy chi tiết luân chuyển #${id}`);

    return await this.prisma.$transaction(async (tx) => {
      await tx.chiTietLuanChuyen.update({
        where: { chiTietLuanChuyenID: id },
        data: { isDelete: true },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Đã xóa chi tiết luân chuyển!',
        data: null,
      };
    });
  }
}