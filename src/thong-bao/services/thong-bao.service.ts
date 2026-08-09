import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongBaoGateway } from '../gateways/thong-bao.gateway';

@Injectable()
export class ThongBaoService {
  constructor(
    private prisma: PrismaService,
    private gateway: ThongBaoGateway,
  ) { }

  findAll() {
    return this.prisma.thongBao.findMany({
      orderBy: { taoLuc: 'desc' },
    });
  }

  findUnread() {
    return this.prisma.thongBao.findMany({
      where: { daDoc: false },
      orderBy: { taoLuc: 'desc' },
    });
  }

  async markAsRead(id: number) {
    const item = await this.prisma.thongBao.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`ThongBao với id ${id} không tồn tại`);
    return this.prisma.thongBao.update({ where: { id }, data: { daDoc: true } });
  }

  async markAllAsRead() {
    return this.prisma.thongBao.updateMany({
      where: { daDoc: false },
      data: { daDoc: true },
    });
  }

  async upsertHopDongNotification(
    hopDongId: string,
    soNgayCon: number,
    tenPhong: string,
    hoTen: string,
    sdt: string,
    ngayHetHan: Date,
  ) {
    const tieuDe = `Hợp đồng sắp hết hạn`;
    const ngayHetHanStr = ngayHetHan.toLocaleDateString('vi-VN');
    const noiDung = [
      `Hợp đồng ${hopDongId}${tenPhong ? ` - Phòng ${tenPhong}` : ''} sắp hết hạn vào ngày ${ngayHetHanStr} (còn ${soNgayCon} ngày).`,
      `Người thuê: ${hoTen || 'Không rõ'}${sdt ? ` — SĐT: ${sdt}` : ''}.`,
    ].join(' ');

    const existing = await this.prisma.thongBao.findFirst({
      where: {
        hopDongId,
        loai: 'HOP_DONG_SAP_HET_HAN',
        daDoc: false,
      },
    });

    if (existing) {
      return this.prisma.thongBao.update({
        where: { id: existing.id },
        data: { soNgayCon, noiDung, taoLuc: new Date() },
      });
    }

    return this.prisma.thongBao.create({
      data: {
        tieuDe,
        noiDung,
        loai: 'HOP_DONG_SAP_HET_HAN',
        hopDongId,
        soNgayCon,
      },
    });
  }

  /**
   * Tạo/cập nhật thông báo cho sự cố sửa chữa khẩn cấp (quá SO_NGAY_GAP ngày chưa xử lý).
   * Dùng chung bảng ThongBao — vì model không có field suaChuaId riêng,
   * mượn tạm cột hopDongId để lưu id của SuaChua theo định dạng "SUACHUA_{id}"
   * (tránh đụng dữ liệu thật của hopDongId, vẫn tận dụng được cơ chế findFirst chống trùng).
   */
  async upsertSuaChuaNotification(
    suaChuaId: number,
    soNgayTre: number,
    tenThietBi: string,
    tenPhong: string,
    nguyenNhan: string | null,
  ) {
    const tieuDe = `Sự cố sửa chữa cần xử lý gấp`;
    const noiDung = [
      `Sự cố #${suaChuaId}${tenThietBi ? ` - Thiết bị ${tenThietBi}` : ''}${tenPhong ? ` (Phòng ${tenPhong})` : ''} đã quá hạn xử lý ${soNgayTre} ngày.`,
      nguyenNhan ? `Nguyên nhân: ${nguyenNhan}.` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const maDinhDanh = `SUACHUA_${suaChuaId}`;

    const existing = await this.prisma.thongBao.findFirst({
      where: {
        hopDongId: maDinhDanh,
        loai: 'SUA_CHUA_KHAN_CAP',
        daDoc: false,
      },
    });

    if (existing) {
      return this.prisma.thongBao.update({
        where: { id: existing.id },
        data: { soNgayCon: soNgayTre, noiDung, taoLuc: new Date() },
      });
    }

    return this.prisma.thongBao.create({
      data: {
        tieuDe,
        noiDung,
        loai: 'SUA_CHUA_KHAN_CAP',
        hopDongId: maDinhDanh,
        soNgayCon: soNgayTre,
      },
    });
  }

  emit(notifications: any[]) {
    this.gateway.sendNotifications(notifications);
  }

  emitSuaChua(notifications: any[]) {
    this.gateway.sendSuaChuaNotifications(notifications);
  }
}