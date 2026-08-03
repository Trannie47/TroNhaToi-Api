import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    const dsPhong = await this.prisma.phong.findMany({
      where: { isDelete: false },
      include:
      {
        loaiPhong: true,
        HopDong: {
          where: { isDelete: false, trangThai: { not: 2 } },
        }
      },
    });
    return dsPhong.map((p) => {
      const phong = p as any;
      let giahientai = 0;
      const hdDangHieuLuc = phong.HopDong.filter((hd: any) => hd.trangThai === 1);
      if (hdDangHieuLuc && hdDangHieuLuc.length > 0) {
        giahientai = hdDangHieuLuc.reduce((sum, hd) => sum + Number(hd.giaPhongThucTe || 0), 0);
      } else {
        giahientai = phong.loaiPhong?.giaTien || 0;
      }
      return {
        ...phong,
        giahientai,
      }
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
            hopDongNguoiThue: {
              where: { isDelete: false },
              include: { nguoithue: true },
            },
          }
        }
      }
    });
    if (!phongWithHopDong || !phongWithHopDong.HopDong) {
      return [];
    }
    return phongWithHopDong.HopDong.flatMap((hd) =>
      hd.hopDongNguoiThue
        .filter((member) => !member.nguoithue.isDelete)
        .map((member) => member.nguoithue),
    );
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


}
