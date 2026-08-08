import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhieuThuDienNuocDto } from '../dto/create-phieu-thu-dien-nuoc.dto';
import { HoaDonDienNuocService } from '../../hoa-don-dien-nuoc/services/hoa-don-dien-nuoc.service';

@Injectable()
export class PhieuThuDienNuocService {
  constructor(
    private prisma: PrismaService,
    private hoaDonDienNuoc: HoaDonDienNuocService,
  ) {}

  //LẬP PHIẾU THU ĐIỆN NƯỚC (THU 1 LẦN)
  async create(dto: CreatePhieuThuDienNuocDto) {
    const { phongId, thangNam, lanGhi, soTien, ghiChu } = dto;

    const hoaDonDN = await this.hoaDonDienNuoc.timTheoLanChot(Number(phongId), thangNam, Number(lanGhi));

    if (!hoaDonDN) {
      throw new NotFoundException(
        `Không tìm thấy hóa đơn điện nước lần ${lanGhi} của phòng ${phongId}!`,
      );
    }

    const numSoTien = Number(soTien);
    if (isNaN(numSoTien) || numSoTien <= 0) {
      throw new BadRequestException('Số tiền thu điện nước phải lớn hơn 0đ!');
    }

    return await this.prisma.$transaction(async (tx) => {
      const phieuThuDN = await tx.phieuThuDienNuoc.upsert({
        where: {
          phongId_thangNam_lanGhi: {
            phongId: Number(phongId),
            thangNam: thangNam,
            lanGhi: Number(lanGhi),
          },
        },
        update: {
          soTien: numSoTien,
          ngayThu: new Date(),
          ghiChu: ghiChu ?? `Thu tiền điện nước tháng ${thangNam} (Lần ${lanGhi})`,
          isDelete: false,
        },
        create: {
          phongId: Number(phongId),
          thangNam: thangNam,
          lanGhi: Number(lanGhi),
          soTien: numSoTien,
          ngayThu: new Date(),
          ghiChu: ghiChu ?? `Thu tiền điện nước tháng ${thangNam} (Lần ${lanGhi})`,
        },
      });

      return {
        success: true,
        message: 'Lập phiếu thu điện nước thành công!',
        data: phieuThuDN,
      };
    });
  }

  //XÓA HÓA ĐƠN / LẦN CHỐT ĐIỆN NƯỚC & ROLLBACK VỀ TRẠNG THÁI NHÁP (TrangThai = 0)
  async remove(phongId: number, thangNam: string, lanGhi: number) {
    return await this.prisma.$transaction(async (tx) => {
      //Kiểm tra xem hóa đơn điện nước này có tồn tại không
      const hoaDonDN = await this.hoaDonDienNuoc.timTheoLanChot(Number(phongId), thangNam, Number(lanGhi), {
        tx,
        kemPhieuThu: true,
      });

      if (!hoaDonDN) {
        throw new NotFoundException(`Không tìm thấy hóa đơn điện nước lần ${lanGhi} của phòng ${phongId}!`);
      }

      // CHẶN XÓA NẾU ĐÃ PHÁT SINH PHIẾU THU TIỀN (VÀ PHIẾU THU ĐÓ CHƯA BỊ XÓA MỀM)
      if (hoaDonDN.phieuThuDienNuoc && !hoaDonDN.phieuThuDienNuoc.isDelete) {
        throw new BadRequestException(
          `Hóa đơn điện nước lần ${lanGhi} đã phát sinh phiếu thu tiền, không được phép xóa để đảm bảo an toàn dữ liệu!`,
        );
      }

      // Xóa MỀM hóa đơn điện nước của lần chốt bị rollback này,giữ lại giá đã
      // chốt để làm giá gợi ý mặc định khi người dùng sửa chỉ số rồi chốt lại.
      await this.hoaDonDienNuoc.xoaHoaDon(tx, Number(phongId), thangNam, Number(lanGhi));

      //ROLLBACK TRẠNG THÁI BẢNG DIENNUOC VỀ 0 (CHƯA CHỐT / NHÁP)
      const updatedDienNuoc = await tx.dienNuoc.update({
        where: {
          phongId_thangNam_lanGhi: {
            phongId: Number(phongId),
            thangNam: thangNam,
            lanGhi: Number(lanGhi),
          },
        },
        data: { TrangThai: 0 }, // Đưa về trạng thái nháp để có thể sửa hoặc chốt lại
      });

      return {
        success: true,
        message: `Đã xóa hóa đơn điện nước lần ${lanGhi} thành công! Dữ liệu đã được rollback về trạng thái chưa chốt.`,
        data: updatedDienNuoc,
      };
    });
  }
}