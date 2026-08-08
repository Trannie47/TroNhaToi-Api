import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThemNguoiOGhepDto } from '../dto/create-nguoi-o-ghep.dto';

@Injectable()
export class NguoiOGhepService {
  constructor(private prisma: PrismaService) { }

  // Thêm người ở ghép vào hợp đồng 
  async themNguoiOGhep(dto: ThemNguoiOGhepDto) {
    const hopDong = await this.prisma.hopDong.findUnique({
      where: { hopDongId: dto.hopDongId, isDelete: false },
      include: { phong: { include: { loaiPhong: true } } },
    });
    if (!hopDong) throw new NotFoundException(`Hợp đồng ${dto.hopDongId} không tồn tại.`);
    if (hopDong.trangThai === 2) {
      throw new BadRequestException('Hợp đồng đã kết thúc, không thể thêm người ở ghép.');
    }

    const dsCccdMoi = dto.danhSachNguoiOGhep.map((ng) => ng.cccd.trim());
    if (new Set(dsCccdMoi).size !== dsCccdMoi.length) {
      throw new BadRequestException('Danh sách người ở ghép không được có CCCD trùng nhau.');
    }

    // Kiểm tra sức chứa phòng
    const soNguoiToiDa = hopDong.phong?.loaiPhong?.soNguoiToiDa;
    if (soNguoiToiDa === null || soNguoiToiDa === undefined) {
      throw new BadRequestException('Loại phòng chưa cấu hình số người tối đa.');
    }

    const soNguoiOGhepHienTai = await this.prisma.nguoiOGhep.count({
      where: { hopDongId: dto.hopDongId, isDelete: false },
    });

    const cccdDaCoTrongHopDongNay = await this.prisma.nguoiOGhep.findMany({
      where: { hopDongId: dto.hopDongId, isDelete: false, cccd: { in: dsCccdMoi } },
      select: { cccd: true },
    });
    const soNguoiThemThatSu = dsCccdMoi.filter(
      (cccd) => !cccdDaCoTrongHopDongNay.some((n) => n.cccd === cccd),
    ).length;

    if (1 + soNguoiOGhepHienTai + soNguoiThemThatSu > soNguoiToiDa) {
      throw new BadRequestException(`Phòng chỉ chứa tối đa ${soNguoiToiDa} người.`);
    }

    // Không được trùng CCCD với người đang ở ghép hợp đồng active khác
    const dangOGhepNoiKhac = await this.prisma.nguoiOGhep.findMany({
      where: {
        cccd: { in: dsCccdMoi },
        hopDongId: { not: dto.hopDongId },
        isDelete: false,
        hopDong: { isDelete: false, trangThai: { in: [0, 1] } },
      },
      select: { cccd: true },
    });
    if (dangOGhepNoiKhac.length > 0) {
      throw new BadRequestException(
        `CCCD đã thuộc hợp đồng đang hoạt động khác: ${dangOGhepNoiKhac.map((n) => n.cccd).join(', ')}`,
      );
    }
    // Không hạn chế việc họ đồng thời đứng đại diện hợp đồng khác - hệ thống chỉ hỗ trợ quản lý
    // cho chủ trọ, không áp đặt quá sâu vào việc 1 người thuê thêm phòng khác cho người thân ở.

    return await this.prisma.$transaction(async (tx) => {
      const ketQua = [];
      for (const ng of dto.danhSachNguoiOGhep) {
        const cccd = ng.cccd.trim();
        const daThem = await tx.nguoiOGhep.upsert({
          where: { cccd_hopDongId: { cccd, hopDongId: dto.hopDongId } },
          update: {
            hoTen: ng.hoTen ?? null,
            sdt: ng.sdt ?? null,
            quanHeVoiDaiDien: ng.quanHeVoiDaiDien ?? null,
            isDelete: false,
          },
          create: {
            cccd,
            hoTen: ng.hoTen ?? null,
            sdt: ng.sdt ?? null,
            quanHeVoiDaiDien: ng.quanHeVoiDaiDien ?? null,
            hopDongId: dto.hopDongId,
            isDelete: false,
          },
        });
        ketQua.push(daThem);
      }
      return { success: true, message: 'Thêm người ở ghép thành công', data: ketQua };
    });
  }

  // Gỡ 1 người ở ghép ra khỏi hợp đồng
  async xoaNguoiOGhep(hopDongId: string, cccd: string) {
    const nguoiOGhep = await this.prisma.nguoiOGhep.findUnique({
      where: { cccd_hopDongId: { cccd, hopDongId } },
    });
    if (!nguoiOGhep || nguoiOGhep.isDelete) {
      throw new NotFoundException(`Không tìm thấy người ở ghép trong hợp đồng.`);
    }

    const deleted = await this.prisma.nguoiOGhep.update({
      where: { cccd_hopDongId: { cccd, hopDongId } },
      data: { isDelete: true },
    });

    return { success: true, message: `Đã xóa người ở ghép ${cccd} khỏi hợp đồng.`, data: deleted };
  }

  // Lấy danh sách người đại diện + người ở ghép của hợp đồng
  async getMembersByHopDong(hopDongId: string) {
    const hopDong = await this.prisma.hopDong.findFirst({
      where: { hopDongId, isDelete: false },
      include: {
        nguoiDaiDien: true,
        nguoiOGhep: { where: { isDelete: false } },
      },
    });
    if (!hopDong) throw new NotFoundException(`Hợp đồng ${hopDongId} không tồn tại.`);

    return {
      success: true,
      data: {
        daiDien: hopDong.nguoiDaiDien,
        danhSachNguoiOGhep: hopDong.nguoiOGhep,
      },
    };
  }
}
