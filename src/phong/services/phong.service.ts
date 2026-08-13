import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhongDto } from '../dto/create-phong.dto';
import { UpdatePhongDto } from '../dto/update-phong.dto';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

@Injectable()
export class PhongService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshotService: ThongKeSnapshotService,
  ) { }


  @Cron('0 0,12 * * *')
  async capNhatTrangThaiPhongTheoLuanChuyen() {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const dsPhong = await this.prisma.phong.findMany({
      where: { isDelete: false },
      include: {
        HopDong: {
          where: { isDelete: false, trangThai: 1 },
          include: {
            phieuLuanChuyen: {
              where: {
                isDelete: false,
                tuNgay: { lte: homNay },
                OR: [{ denNgay: null }, { denNgay: { gte: homNay } }],
              },
            },
          },
        },
      },
    });

    const capNhat: { phongId: number; trangThaiMoi: number }[] = [];

    for (const phong of dsPhong) {
      const tongHopDong = phong.HopDong.length;

      // Không có hợp đồng nào đang hiệu lực -> bỏ qua, không tự động đổi trạng thái
      if (tongHopDong === 0) continue;

      const soHopDongDaLuanChuyenDi = phong.HopDong.filter((hd) =>
        hd.phieuLuanChuyen.some((lc) => lc.phongMoiId !== phong.phongId),
      ).length;

      const trangThaiMoi =
        soHopDongDaLuanChuyenDi === tongHopDong ? 2 : 1;

      if (phong.trangThai !== trangThaiMoi) {
        capNhat.push({ phongId: phong.phongId, trangThaiMoi });
      }
    }

    if (capNhat.length === 0) return;

    await this.prisma.$transaction(async (tx) => {
      for (const item of capNhat) {
        await tx.phong.update({
          where: { phongId: item.phongId },
          data: { trangThai: item.trangThaiMoi },
        });
      }
      await this.thongKeSnapshotService.invalidateAll(tx);
    });
  }

  async findAll() {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const dsPhong = await this.prisma.phong.findMany({
      where: { isDelete: false },
      include: {
        loaiPhong: true,
        HopDong: {
          where: { isDelete: false, trangThai: { not: 2 } },
          include: {
            nguoiOGhep: {
              where: { isDelete: false },
              select: { cccd: true },
            },
          },
        },
        phieuLuanChuyenDen: {
          where: {
            isDelete: false,

            tuNgay: { lte: homNay },
            OR: [
              { denNgay: null },
              { denNgay: { gte: homNay } },
            ],
          },
          include: {
            hopDong: {
              include: {
                nguoiDaiDien: true,
                nguoiOGhep: { where: { isDelete: false } },
              },
            },
          },
        },
      },
    });

    return dsPhong.map((p) => {

      const phong = p as any;
      let giahientai = 0;
      let soNguoiHienTai = 0;

      const hdDangHieuLuc = phong.HopDong.filter((hd: any) => hd.trangThai === 1);

      if (hdDangHieuLuc && hdDangHieuLuc.length > 0) {
        giahientai = hdDangHieuLuc.reduce((sum, hd) => sum + Number(hd.giaPhongThucTe || 0), 0);
        soNguoiHienTai = hdDangHieuLuc.reduce(
          (sum: number, hd: any) => sum + 1 + hd.nguoiOGhep.length,
          0,
        );
      } else {
        giahientai = phong.loaiPhong?.giaTien || 0;
      }

      const soNguoiChuyenDen = (phong.phieuLuanChuyenDen ?? []).reduce(
        (sum: number, lc: any) => {
          const hd = lc.hopDong;

          if (
            !hd ||
            hd.isDelete ||
            hd.trangThai !== 1
          ) {
            return sum;
          }

          const soDaiDien =
            hd.nguoiDaiDien &&
              !hd.nguoiDaiDien.isDelete
              ? 1
              : 0;

          return (
            sum +
            soDaiDien +
            hd.nguoiOGhep.length
          );
        },
        0,
      );

      soNguoiHienTai += soNguoiChuyenDen;

      const { phieuLuanChuyenDen, ...phongData } = phong;

      return {
        ...phongData,
        giahientai,
        soNguoiHienTai,
      };
    });
  }

  async getListNguoiThueByPhongId(phongId: number) {
    const phongWithHopDong = await this.prisma.phong.findFirst({
      where: {
        phongId: phongId,
        isDelete: false,
      },
      include: {
        HopDong: {
          where: { isDelete: false, trangThai: { not: 2 } },
          include: {
            nguoiDaiDien: true,
            nguoiOGhep: { where: { isDelete: false } },
          }
        }
      }
    });
    if (!phongWithHopDong || !phongWithHopDong.HopDong) {
      return [];
    }
    return phongWithHopDong.HopDong.flatMap((hd) => [
      ...(hd.nguoiDaiDien && !hd.nguoiDaiDien.isDelete ? [hd.nguoiDaiDien] : []),
      ...hd.nguoiOGhep,
    ]);
  }
  // Lấy thoong tin chi tiết phòng theo ID
  async findOne(id: number) {
    const item = await this.prisma.phong.findUnique({
      where: { phongId: id },
      include: { loaiPhong: true, HopDong: { where: { isDelete: false, trangThai: { not: 2 } } } },
    });
    if (!item) throw new NotFoundException(`Phong với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreatePhongDto) {
    return this.prisma.$transaction(async (tx) => {
      const phong = await tx.phong.create({
        data: {
          tenPhong: dto.tenPhong,
          trangThai: dto.trangThai,
          moTa: dto.moTa,
          maLoaiPhong: dto.maLoaiPhong,
          isDelete: false,
        },
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return phong;
    });
  }

  async update(id: number, dto: UpdatePhongDto) {
    await this.findOne(id);
    const roomCurrent = await this.prisma.phong.findUnique({
      where: { phongId: id },
    });
    if (!roomCurrent) throw new NotFoundException(`Phong với id ${id} không tồn tại`);
    return this.prisma.$transaction(async (tx) => {
      const phong = await tx.phong.update({
        where: { phongId: id },
        data: {
          tenPhong: dto.tenPhong,
          trangThai: dto.trangThai,
          moTa: dto.moTa,
          maLoaiPhong: dto.maLoaiPhong,
        },
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return phong;
    });
  }

  async getPhongByThietBiId(thietBiId: number) {
    const dsLapRap = await this.prisma.lapRap.findMany({
      where: {
        thietBiId,
        isDelete: false,
      },
      orderBy: {
        ngayLap: 'desc',
      },
      include: {
        phong: {
          include: {
            loaiPhong: true,
            HopDong: {
              where: {
                isDelete: false,
                trangThai: 1,
              },
            },
          },
        },
      },
    });

    if (dsLapRap.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy phòng cho thiết bị với id ${thietBiId}`,
      );
    }

    const lapRapIds = dsLapRap.map((lr) => lr.id);

    // Tra cứu sự cố sửa chữa theo đúng bản ghi lắp ráp (lapRapId), không còn qua phongId nữa
    const dsSuaChua = await this.prisma.suaChua.findMany({
      where: {
        lapRapId: { in: lapRapIds },
        isDelete: false,
      },
      include: { hoadonsuachua: true },
    });

    const thongKeTheoLapRap = new Map<number, { dangSua: boolean; hong: boolean }>();

    for (const sc of dsSuaChua) {
      if (sc.lapRapId == null) continue;

      const hoaDon =
        sc.hoadonsuachua && !sc.hoadonsuachua.isDelete ? sc.hoadonsuachua : null;

      const current = thongKeTheoLapRap.get(sc.lapRapId) ?? { dangSua: false, hong: false };

      if (hoaDon?.trangThai === 3) {
        current.hong = true;
      } else if (!hoaDon || hoaDon.trangThai === 0) {
        current.dangSua = true;
      }
      // trangThai === 1 hoặc 2: không tính

      thongKeTheoLapRap.set(sc.lapRapId, current);
    }

    const result = dsLapRap
      .filter((lr) => {
        if (lr.phongId == null) return false;

        // Mỗi LapRap giờ là 1 thiết bị cụ thể — chỉ tính là "còn dùng được"
        // nếu không đang sửa chữa và không hỏng
        const thongKe = thongKeTheoLapRap.get(lr.id) ?? { dangSua: false, hong: false };
        return !thongKe.dangSua && !thongKe.hong;
      })
      .map((lr) => {
        const phong = lr.phong as any;

        let giahientai = 0;
        if (phong.HopDong && phong.HopDong.length > 0) {
          giahientai = phong.HopDong.reduce(
            (sum: number, hd: any) => sum + (hd.giaPhongThucTe || 0),
            0,
          );
        } else {
          giahientai = phong.loaiPhong?.giaTien || 0;
        }

        return {
          ...phong,
          giahientai,
        };
      });

    return result;
  }

  async remove(id: number) {
    await this.findOne(id);
    const hopDongConHieuLuc = await this.prisma.hopDong.findFirst({
      where: {
        phongId: id,
        isDelete: false,
        trangThai: { not: 2 },
      },
    });
    if (hopDongConHieuLuc) {
      throw new BadRequestException(
        'Không thể ẩn! Phòng đang có dữ liệu Hợp đồng liên kết (đang chờ hoặc đang hiệu lực). Vui lòng xử lý hợp đồng trước!'
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const phong = await tx.phong.update({
        where: { phongId: id },
        data: { isDelete: true },
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return phong;
    });
  }

  async findPhongConChoTrong() {
    const danhSachPhong = await this.prisma.phong.findMany({
      where: { isDelete: false },
      include: {
        loaiPhong: true,
        HopDong: {
          where: {
            isDelete: false,
            trangThai: 1,
          },
        },
      },
    });

    const result = danhSachPhong
      .map((phong) => {
        const { HopDong, ...phongData } = phong;
        const soNguoiHienTai = HopDong.length;
        const soNguoiToiDa = phongData.loaiPhong?.soNguoiToiDa ?? null;

        return {
          ...phongData,
          soNguoiHienTai,
          soNguoiToiDa,
          soChoConLai: soNguoiToiDa !== null ? soNguoiToiDa - soNguoiHienTai : null,
        };
      })
      .filter((phong) => phong.soNguoiToiDa !== null && phong.soNguoiHienTai < phong.soNguoiToiDa)
      .sort((a, b) => (b.soChoConLai ?? 0) - (a.soChoConLai ?? 0));

    return result;
  }


  async getCoTheLuanChuyenByHopDong(hopDongId: string) {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const hopDongNguon = await this.prisma.hopDong.findFirst({
      where: { hopDongId, isDelete: false },
      include: {
        nguoiDaiDien: true,
        nguoiOGhep: { where: { isDelete: false } },
      },
    });

    if (!hopDongNguon) {
      throw new NotFoundException(`Không tìm thấy hợp đồng #${hopDongId}`);
    }

    // Số người dự tính chuyển qua = đại diện (nếu chưa xóa) + số người ở ghép
    const soNguoiChuyenQua =
      (hopDongNguon.nguoiDaiDien && !hopDongNguon.nguoiDaiDien.isDelete ? 1 : 0) +
      hopDongNguon.nguoiOGhep.length;

    const dsPhongKhac = await this.prisma.phong.findMany({
      where: {
        isDelete: false,
        trangThai: { not: 2 }, // loại phòng đang sửa chữa
        phongId: { not: hopDongNguon.phongId ?? undefined },
      },
      include: {
        loaiPhong: true,
        HopDong: {
          where: {
            isDelete: false,
            trangThai: 1,
            ngayHetHan: { gte: homNay }, // hợp đồng còn hạn mới tính người đang ở
          },
          include: {
            nguoiDaiDien: true,
            nguoiOGhep: { where: { isDelete: false } },
          },
        },


        phieuLuanChuyenDen: {
          where: {
            isDelete: false,
            tuNgay: {
              lte: homNay,
            },
            OR: [
              { denNgay: null },
              { denNgay: { gte: homNay } },
            ],
          },
          include: {
            hopDong: {
              include: {
                nguoiDaiDien: true,
                nguoiOGhep: {
                  where: {
                    isDelete: false,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = dsPhongKhac
      .map((p) => {
        const phong = p as any;
        const soNguoiToiDa = phong.loaiPhong?.soNguoiToiDa ?? null;

        const soNguoiTuHopDong = phong.HopDong.reduce((sum: number, hd: any) => {
          const soDaiDien = hd.nguoiDaiDien && !hd.nguoiDaiDien.isDelete ? 1 : 0;
          return sum + soDaiDien + hd.nguoiOGhep.length;
        }, 0);

        // Cộng thêm người đã/đang chuyển tới phòng này qua phiếu luân chuyển còn hiệu lực
        const soNguoiTuLuanChuyen = phong.phieuLuanChuyenDen.reduce((sum: number, lc: any) => {
          const hd = lc.hopDong;
          if (!hd) return sum;
          const soDaiDien = hd.nguoiDaiDien && !hd.nguoiDaiDien.isDelete ? 1 : 0;
          return sum + soDaiDien + hd.nguoiOGhep.length;
        }, 0);

        const soNguoiDangO = soNguoiTuHopDong + soNguoiTuLuanChuyen;

        const soChoConLai =
          soNguoiToiDa !== null
            ? soNguoiToiDa - soNguoiDangO - soNguoiChuyenQua
            : null;

        return {
          ...phong,
          soNguoiDangO,
          soNguoiChuyenQua,
          soChoConLai,
        };
      })
      .filter((phong) => phong.soChoConLai !== null && phong.soChoConLai >= 0)
      .sort((a, b) => (b.soChoConLai ?? 0) - (a.soChoConLai ?? 0));

    return result;
  }

}