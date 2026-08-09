import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongBaoService } from './thong-bao.service';

const SO_NGAY_GAP = 7; // Quá 7 ngày chưa xử lý xong -> đánh dấu "Gấp"

@Injectable()
export class SuaChuaJobService {
  private readonly logger = new Logger(SuaChuaJobService.name);

  constructor(
    private prisma: PrismaService,
    private thongBaoService: ThongBaoService,
  ) { }

  @Cron('0 8 * * *')
  async kiemTraSuaChuaKhanCap() {
    this.logger.log('Bắt đầu kiểm tra sự cố sửa chữa khẩn cấp...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mocGap = new Date(today);
    mocGap.setDate(mocGap.getDate() - SO_NGAY_GAP);

    const dsSuaChuaChuaXong = await this.prisma.suaChua.findMany({
      where: {
        isDelete: false,
        ngaySuaChua: {
          lte: mocGap,
        },
        OR: [
          { hoadonsuachua: null },
          {
            hoadonsuachua: {
              isDelete: false,
              trangThai: { notIn: [2, 3, 4] },
            },
          },
        ],
      },
      include: {
        thietbi: { select: { tenThietBi: true } },
        lapRap: {
          select: {
            id: true,
            phong: { select: { phongId: true, tenPhong: true } },
          },
        },
        hoadonsuachua: true,
      },
    });

    if (dsSuaChuaChuaXong.length === 0) {
      this.logger.log('Không có sự cố sửa chữa nào cần đánh dấu khẩn cấp.');
      return;
    }

    const idsCanDanhDau = dsSuaChuaChuaXong
      .filter((sc) => sc.trangThaiThongBao !== 1)
      .map((sc) => sc.id);

    if (idsCanDanhDau.length > 0) {
      await this.prisma.suaChua.updateMany({
        where: { id: { in: idsCanDanhDau } },
        data: { trangThaiThongBao: 1 },
      });
    }

    const notifications: any[] = [];

    for (const sc of dsSuaChuaChuaXong) {
      const soNgayTre = Math.floor(
        (today.getTime() - sc.ngaySuaChua!.getTime()) / (1000 * 60 * 60 * 24),
      );
      const tenThietBi = sc.thietbi?.tenThietBi ?? '';
      const tenPhong = sc.lapRap?.phong?.tenPhong ?? '';

      const notification = await this.thongBaoService.upsertSuaChuaNotification(
        sc.id,
        soNgayTre,
        tenThietBi,
        tenPhong,
        sc.nguyenNhan,
      );

      notifications.push({
        ...notification,
        suaChuaId: sc.id,
        tenThietBi,
        tenPhong,
        ngaySuaChua: sc.ngaySuaChua,
        soNgayTre,
      });
    }

    this.logger.log(
      `Đã đánh dấu ${idsCanDanhDau.length} sự cố khẩn cấp, gửi ${notifications.length} thông báo.`,
    );

    this.thongBaoService.emitSuaChua(notifications);
  }

  async triggerManual() {
    return this.kiemTraSuaChuaKhanCap();
  }
}