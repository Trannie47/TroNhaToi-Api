import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhieuThuHangThangDto } from '../dto/create-phieu-thu-hang-thang.dto';

@Injectable()
export class PhieuThuHangThangService {
  constructor(private prisma: PrismaService) {}

  
 //TÍNH TOÁN & CẬP NHẬT TRẠNG THÁI HÓA ĐƠN
  async capNhatTrangThaiHoaDon(tx: any, maHoaDon: string) {
    const hoaDon = await tx.hoaDonPhong.findUnique({
      where: { maHoaDon },
    });

    if (!hoaDon) return { trangThai: 0, soTien: 0, tongDaThu: 0, conNo: 0 };

    // Lấy danh sách phiếu thu chưa xóa
    const dsPhieuThu = await tx.phieuThuHangThang.findMany({
      where: { maHoaDon, isDelete: false },
    });

    const tongDaThu = dsPhieuThu.reduce(
      (sum: number, pt: any) => sum + Number(pt.soTien ?? 0),
      0,
    );

    const tongTienHD = Number(hoaDon.soTien ?? 0);

    // Xử lý linh hoạt trạng thái
    let trangThaiMoi = 0;
    if (tongDaThu >= tongTienHD && tongTienHD > 0) {
      trangThaiMoi = 2; // Đã thanh toán đủ (Hoặc dư)
    } else if (tongDaThu > 0) {
      trangThaiMoi = 1; // Thanh toán 1 phần
    } else {
      trangThaiMoi = 0; // Chưa thanh toán
    }

    // Cập nhật trạng thái mới vào DB
    await tx.hoaDonPhong.update({
      where: { maHoaDon },
      data: { trangThai: trangThaiMoi },
    });

    const conNo = tongTienHD - tongDaThu > 0 ? tongTienHD - tongDaThu : 0;

    return {
      trangThai: trangThaiMoi,
      soTien: tongTienHD,
      tongDaThu,
      conNo,
    };
  }

  //Tạo phiéu mới
  async create(dto: CreatePhieuThuHangThangDto) {
    const { maHoaDon, soTien, ghiChu } = dto;

    const hoaDon = await this.prisma.hoaDonPhong.findUnique({
      where: { maHoaDon },
    });

    if (!hoaDon || hoaDon.isDelete) {
      throw new NotFoundException(`Không tìm thấy hóa đơn mã ${maHoaDon}`);
    }

    const numSoTien = Number(soTien);
    if (isNaN(numSoTien) || numSoTien <= 0) {
      throw new BadRequestException('Số tiền thu phải lớn hơn 0!');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Tạo phiếu thu mới
      const phieuThuMoi = await tx.phieuThuHangThang.create({
        data: {
          maHoaDon: maHoaDon,
          soTien: numSoTien,
          ngayThu: new Date(),
          ghiChu: ghiChu ?? `Thu tiền hóa đơn ${maHoaDon}`,
        },
      });

      // Tự động tính toán & Cập nhật lại trạng thái Hóa đơn
      const resultStat = await this.capNhatTrangThaiHoaDon(tx, maHoaDon);

      return {
        success: true,
        message: 'Lập phiếu thu thành công!',
        data: {
          phieuThu: phieuThuMoi,
          hoaDonUpdated: {
            maHoaDon,
            trangThai: resultStat.trangThai,
            soTien: resultStat.soTien,
            tongDaThu: resultStat.tongDaThu,
            conNo: resultStat.conNo,
          },
        },
      };
    });
  }

 //LẤY DANH SÁCH PHIẾU THU THEO MÃ HÓA ĐƠN
  async findByMaHoaDon(maHoaDon: string) {
    const list = await this.prisma.phieuThuHangThang.findMany({
      where: { maHoaDon, isDelete: false },
      orderBy: { ngayThu: 'desc' },
    });

    return {
      success: true,
      data: list,
    };
  }

//Xóa Phiếu Thu
  async remove(maPhieuThu: number) {
    const phieuThu = await this.prisma.phieuThuHangThang.findUnique({
      where: { maPhieuThu },
    });

    if (!phieuThu || phieuThu.isDelete) {
      throw new NotFoundException(`Không tìm thấy phiếu thu #${maPhieuThu}`);
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.phieuThuHangThang.update({
        where: { maPhieuThu },
        data: { isDelete: true },
      });

      let stat = null;
      if (phieuThu.maHoaDon) {
        stat = await this.capNhatTrangThaiHoaDon(tx, phieuThu.maHoaDon);
      }

      return {
        success: true,
        message: 'Đã xóa phiếu thu và tính lại nợ hóa đơn!',
        data: stat,
      };
    });
  }
}