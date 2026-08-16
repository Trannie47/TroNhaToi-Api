import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HoaDonDienNuocService {
  constructor(private prisma: PrismaService) { }

  async layDanhSachChuaThanhToan(phongId: number, thangNam?: string) {
    const danhSach = await this.prisma.hoaDonDienNuoc.findMany({
      where: { phongId, isDelete: false, ...(thangNam ? { thangNam } : {}) },
      include: { phieuThuDienNuoc: { where: { isDelete: false } } },
    });

    return danhSach.filter((hd) => {
      const tongTien = Number(hd.tongTien);
      const daThu = Number(hd.phieuThuDienNuoc?.soTien ?? 0);
      return tongTien > 0 && tongTien - daThu > 0;
    });
  }

  // Danh sách đầy đủ hóa đơn điện nước còn hiệu lực theo kỳ
  async layDanhSachTheoThangDeHienThi(phongId: number, thangNam: string) {
    return this.prisma.hoaDonDienNuoc.findMany({
      where: { phongId, thangNam, isDelete: false },
      include: {
        dienNuoc: { include: { phong: true } },
        phieuThuDienNuoc: { where: { isDelete: false } },
      },
      orderBy: { lanGhi: 'desc' },
    });
  }

  // Danh sách đầy đủ hóa đơn điện nước còn hiệu lực của TẤT CẢ các kỳ (không lọc thangNam)
  async layTatCaDanhSachDeHienThi(phongId: number) {
    return this.prisma.hoaDonDienNuoc.findMany({
      where: { phongId, isDelete: false },
      include: {
        dienNuoc: { include: { phong: true } },
        phieuThuDienNuoc: { where: { isDelete: false } },
      },
      orderBy: [{ thangNam: 'desc' }, { lanGhi: 'desc' }],
    });
  }

  // Tìm đúng 1 hóa đơn theo lần chốt. Mặc định chỉ lấy hóa đơn còn hiệu lực (isDelete: false);
  // truyền kemDaXoa: true khi cần lấy lại giá đã chốt của 1 lần chốt đang được sửa lại (hóa đơn
  // đó đã bị xóa mềm để rollback, nhưng giá cũ vẫn cần dùng làm gợi ý).
  async timTheoLanChot(
    phongId: number,
    thangNam: string,
    lanGhi: number,
    options?: { tx?: any; kemPhieuThu?: boolean; kemDaXoa?: boolean },
  ) {
    const client = options?.tx ?? this.prisma;
    return client.hoaDonDienNuoc.findUnique({
      where: {
        phongId_thangNam_lanGhi: { phongId, thangNam, lanGhi },
        ...(options?.kemDaXoa ? {} : { isDelete: false }),
      },
      ...(options?.kemPhieuThu ? { include: { phieuThuDienNuoc: true } } : {}),
    });
  }

  async chotHoaDon(
    tx: any,
    params: {
      phongId: number;
      thangNam: string;
      lanGhi: number;
      giaDienApDung: number;
      giaNuocApDung: number;
      tienDien: number;
      tienNuoc: number;
      ngayLap: Date;
    },
  ) {
    const { phongId, thangNam, lanGhi, giaDienApDung, giaNuocApDung, tienDien, tienNuoc, ngayLap } = params;
    return tx.hoaDonDienNuoc.upsert({
      where: { phongId_thangNam_lanGhi: { phongId, thangNam, lanGhi } },
      update: {
        giaDienApDung,
        giaNuocApDung,
        tienDien: new Prisma.Decimal(tienDien),
        tienNuoc: new Prisma.Decimal(tienNuoc),
        tongTien: new Prisma.Decimal(tienDien + tienNuoc),
        ngayLap,
        isDelete: false,
      },
      create: {
        phongId,
        thangNam,
        lanGhi,
        giaDienApDung,
        giaNuocApDung,
        tienDien: new Prisma.Decimal(tienDien),
        tienNuoc: new Prisma.Decimal(tienNuoc),
        tongTien: new Prisma.Decimal(tienDien + tienNuoc),
        ngayLap,
        isDelete: false,
      },
    });
  }

  async xoaHoaDon(tx: any, phongId: number, thangNam: string, lanGhi: number) {
    return tx.hoaDonDienNuoc.update({
      where: { phongId_thangNam_lanGhi: { phongId, thangNam, lanGhi } },
      data: { isDelete: true },
    });
  }
}
