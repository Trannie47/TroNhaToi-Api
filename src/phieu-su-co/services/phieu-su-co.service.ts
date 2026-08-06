import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { CreatePhieuSuCoDto } from '../dto/create-phieu-su-co.dto';
import { StatisticsPhieuSuCoDto } from '../dto/statistics-phieu-su-co.dto';
import { UpdatePhieuSuCoDto } from '../dto/update-phieu-su-co.dto';

@Injectable()
export class PhieuSuCoService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshot: ThongKeSnapshotService,
  ) { }

  async findAll(phongId?: number) {
    const list = await this.prisma.phieuSuCo.findMany({
      where: {
        isDelete: false,
        ...(phongId != null
          ? { phongId }
          : {}),
      },

      include: { phong: true },
      orderBy: { suCoId: 'desc' },
    });

    return { success: true, data: list };
  }

  async findOne(id: number) {
    const item = await this.prisma.phieuSuCo.findFirst({
      where: { suCoId: id, isDelete: false },
      include: { phong: true, chiTietLuanChuyen: true },
    });

    if (!item) throw new NotFoundException(`Không tìm thấy phiếu sự cố #${id}`);

    return { success: true, data: item };
  }
  // luân chuyển lấy thông tin sự cố 
  async getLuanChuyen(id: number) {
    const suCo = await this.prisma.phieuSuCo.findFirst({
      where: {
        suCoId: id,
        isDelete: false,
      },
      include: {
        phong: {
          include: {
            loaiPhong: true,
          },
        },
      },
    });

    if (!suCo) {
      throw new NotFoundException("Không tìm thấy sự cố");
    }

    // Lấy hợp đồng của phòng đó

    const hopDong = await this.prisma.hopDong.findMany({
      where: {
        phongId: suCo.phongId,
        isDelete: false,
        trangThai: 1,
      },
      include: {
        hopDongNguoiThue: {
          where: {
            isDelete: false,
          },
          include: {
            nguoithue: true,
          },
        },
      },
    });

    const phong = await this.prisma.phong.findMany({
      where: {
        isDelete: false,
      },
      include: {
        loaiPhong: true,
      },
    });

    const phongChuyen = await Promise.all(
      phong
        .filter((p) => p.phongId !== suCo.phongId)
        .map(async (p) => {
          const hopDongPhong = await this.prisma.hopDong.findFirst({
            where: {
              phongId: p.phongId,
              isDelete: false,
              trangThai: 1,
            },
            include: {
              hopDongNguoiThue: {
                where: {
                  isDelete: false,
                },
              },
            },
          });

          const soNguoiDangO =
            hopDongPhong?.hopDongNguoiThue.length ?? 0;

          const sucChua = p.loaiPhong?.soNguoiToiDa ?? 0;
          return {
            phongId: p.phongId,
            tenPhong: p.tenPhong,
            sucChua,
            soNguoiDangO,
            soChoTrong: sucChua - soNguoiDangO,
            daCoHopDong: hopDongPhong != null,
          };
        }),
    );

    return {
      success: true,
      data: {
        suCo,
        hopDong,
        phongChuyen,
      },
    };
  }


  // Tạo phiếu sự cố mới (kèm chi tiết luân chuyển nếu có)
  async create(dto: CreatePhieuSuCoDto) {
    const { chiTietLuanChuyen, ...phieuData } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const phieuMoi = await tx.phieuSuCo.create({
        data: {
          ...phieuData,
          ngayBatDau: phieuData.ngayBatDau ? new Date(phieuData.ngayBatDau) : undefined,
          ngayHoanThanh: phieuData.ngayHoanThanh ? new Date(phieuData.ngayHoanThanh) : undefined,
        },
      });

      let danhSachLuanChuyen: any[] = [];
      if (chiTietLuanChuyen && chiTietLuanChuyen.length > 0) {
        danhSachLuanChuyen = await Promise.all(
          chiTietLuanChuyen.map((ctlc) =>
            tx.chiTietLuanChuyen.create({
              data: {
                suCoId: phieuMoi.suCoId,
                hopDongId: ctlc.hopDongId,
                phongMoiId: ctlc.phongMoiId,
                trangThaiLuanChuyen: ctlc.trangThaiLuanChuyen,
                ghiChu: ctlc.ghiChu,
                ngayLuanChuyen: ctlc.ngayLuanChuyen ? new Date(ctlc.ngayLuanChuyen) : undefined,
              },
            }),
          ),
        );
      }

      // Invalidate snapshot thống kê vì phát sinh sự cố mới (ảnh hưởng chi phí)
      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Tạo phiếu sự cố thành công!',
        data: { ...phieuMoi, chiTietLuanChuyen: danhSachLuanChuyen },
      };
    });
  }

  async update(id: number, dto: UpdatePhieuSuCoDto) {
    const existing = await this.prisma.phieuSuCo.findFirst({
      where: { suCoId: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy phiếu sự cố #${id}`);

    const { chiTietLuanChuyen, ...phieuData } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.phieuSuCo.update({
        where: { suCoId: id },
        data: {
          ...phieuData,
          ngayBatDau: phieuData.ngayBatDau ? new Date(phieuData.ngayBatDau) : undefined,
          ngayHoanThanh: phieuData.ngayHoanThanh ? new Date(phieuData.ngayHoanThanh) : undefined,
        },
      });

      let danhSachLuanChuyenMoi: any[] = [];
      if (chiTietLuanChuyen && chiTietLuanChuyen.length > 0) {
        danhSachLuanChuyenMoi = await Promise.all(
          chiTietLuanChuyen.map((ctlc) =>
            tx.chiTietLuanChuyen.create({
              data: {
                suCoId: id,
                hopDongId: ctlc.hopDongId,
                phongMoiId: ctlc.phongMoiId,
                trangThaiLuanChuyen: ctlc.trangThaiLuanChuyen,
                ghiChu: ctlc.ghiChu,
                ngayLuanChuyen: ctlc.ngayLuanChuyen ? new Date(ctlc.ngayLuanChuyen) : undefined,
              },
            }),
          ),
        );
      }

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Cập nhật phiếu sự cố thành công!',
        data: { ...updated, chiTietLuanChuyenMoi: danhSachLuanChuyenMoi },
      };
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.phieuSuCo.findFirst({
      where: { suCoId: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy phiếu sự cố #${id}`);

    return await this.prisma.$transaction(async (tx) => {
      await tx.phieuSuCo.update({
        where: { suCoId: id },
        data: { isDelete: true },
      });

      // Invalidate snapshot vì đã xóa 1 khoản chi phí sự cố
      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Đã xóa phiếu sự cố!',
        data: null,
      };
    });
  }

  async statisticsPhieuSuCo(req: StatisticsPhieuSuCoDto) {
    const year = req.year ?? new Date().getFullYear();
    const from = new Date(Date.UTC(year, 0, 1));
    const to = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const items = await this.prisma.phieuSuCo.findMany({
      where: {
        isDelete: false,
        ngayBatDau: { gte: from, lte: to },
      },
      select: {
        ngayBatDau: true,
        ngayHoanThanh: true,
        chiPhi: true,
      },
    });

    const byMonth = Array.from({ length: 12 }, (_, index) => ({
      month: `${year}-${String(index + 1).padStart(2, '0')}`,
      totalSuCo: 0,
      totalChiPhi: 0,
      totalHoanThanh: 0,
      totalDangXuLy: 0,
    }));

    let totalChiPhi = 0;
    let totalHoanThanh = 0;
    let totalDangXuLy = 0;

    for (const item of items) {
      if (!item.ngayBatDau) continue;

      const chiPhi = Number(item.chiPhi ?? 0);
      const daHoanThanh = !!item.ngayHoanThanh;
      const month = byMonth[item.ngayBatDau.getUTCMonth()];

      month.totalSuCo += 1;
      month.totalChiPhi += chiPhi;
      if (daHoanThanh) {
        month.totalHoanThanh += 1;
      } else {
        month.totalDangXuLy += 1;
      }

      totalChiPhi += chiPhi;
      if (daHoanThanh) {
        totalHoanThanh += 1;
      } else {
        totalDangXuLy += 1;
      }
    }

    return {
      year,
      totalSuCo: items.length,
      totalChiPhi,
      totalHoanThanh,
      totalDangXuLy,
      byMonth,
    };
  }
}