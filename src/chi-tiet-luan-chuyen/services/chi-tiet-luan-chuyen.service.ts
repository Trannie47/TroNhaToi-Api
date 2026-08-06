import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { CreateChiTietLuanChuyenDto } from '../dto/create-chi-tiet-luan-chuyen.dto';
import { UpdateChiTietLuanChuyenDto } from '../dto/update-chi-tiet-luan-chuyen.dto';
import { HopDongLuanChuyenDto, PhongHopDongDto } from '../dto/phong-hop-dong-dto';

@Injectable()
export class ChiTietLuanChuyenService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshot: ThongKeSnapshotService,
  ) { }

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
  /**
   * Giữ nguyên hàm gốc của bạn.
   */
  findBySuCo(suCoId: number) {
    return this.prisma.chiTietLuanChuyen.findMany({
      where: { suCoId, isDelete: false },
      include: { phongMoi: true },
    });
  }

  async getLuanChuyenViewBySuCo(suCoId: number) {
    const suCo = await this.prisma.phieuSuCo.findUnique({
      where: { suCoId },
      include: { phong: true },
    });
    if (!suCo || !suCo.phong) return [];
 
    const phongCu = suCo.phong;
 
    // Tất cả hợp đồng đang hiệu lực của phòng bị sự cố (có thể nhiều hợp đồng)
    const dsHopDong = await this.prisma.hopDong.findMany({
      where: { phongId: phongCu.phongId, isDelete: false, trangThai: 1 },
      include: {
        hopDongNguoiThue: {
          where: { isDelete: false },
          include: { nguoithue: true },
        },
      },
    });
 
    if (!dsHopDong.length) return [];
 
    // Danh sách phòng khác để chọn luân chuyển tới - dùng chung cho mọi hợp đồng
    const dsPhongKhac = await this.prisma.phong.findMany({
      where: { isDelete: false, phongId: { not: phongCu.phongId } },
      include: { loaiPhong: true },
    });
 
    const dsPhongHopDong = await Promise.all(
      dsPhongKhac.map(async (p) => {
        const soNguoiDangO = await this.demSoNguoiDangO(p.phongId);
        const sucChua = p.loaiPhong?.soNguoiToiDa ?? null;
        const daCoHopDong = await this.coHopDongDangHieuLuc(p.phongId);
 
        return {
          phongId: p.phongId,
          tenPhong: p.tenPhong,
          sucChua,
          soNguoiDangO,
          soChoTrong: sucChua != null ? sucChua - soNguoiDangO : null,
          daCoHopDong,
          suCoId,
        };
      }),
    );
 
    // Với mỗi hợp đồng -> build 1 HopDongLuanChuyenVM
    const result = await Promise.all(
      dsHopDong.map(async (hopDong) => {
        const thanhVien = hopDong.hopDongNguoiThue.filter((t) => t.nguoithue);
        const daiDien = thanhVien.find((t) => t.laDaiDien) ?? thanhVien[0];
 
        // Hợp đồng này đã chọn phòng mới cho sự cố này chưa?
        const chiTiet = await this.prisma.chiTietLuanChuyen.findFirst({
          where: {
            suCoId,
            hopDongId: hopDong.hopDongId,
            isDelete: false,
          },
          orderBy: { chiTietLuanChuyenID: 'desc' },
          include: { phongMoi: { include: { loaiPhong: true } } },
        });
 
        let phongMoiId: number | null = null;
        let phongMoiText: string | null = null;
        let sucChuaMoi: number | null = null;
        let soNguoiDangOMoi = 0;
        let soChoTrongMoi: number | null = null;
        let trangThaiText = 'Chưa chọn phòng mới';
 
        if (chiTiet?.phongMoi) {
          const pm = chiTiet.phongMoi;
          phongMoiId = pm.phongId;
          phongMoiText = pm.tenPhong ?? null;
          sucChuaMoi = pm.loaiPhong?.soNguoiToiDa ?? null;
          soNguoiDangOMoi = await this.demSoNguoiDangO(pm.phongId);
          soChoTrongMoi =
            sucChuaMoi != null ? sucChuaMoi - soNguoiDangOMoi : null;
          trangThaiText = this.mapTrangThaiLuanChuyen(
            chiTiet.trangThaiLuanChuyen,
          );
        }
 
        return {
          maHopDong: hopDong.hopDongId,
          tenNguoiDaiDien: daiDien?.nguoithue?.hoTen ?? null,
          soThanhVien: thanhVien.length,
          dsThanhVien: thanhVien
            .map((t) => t.nguoithue?.hoTen)
            .filter((x): x is string => !!x),
          dsPhongHopDong,
          phongCuText: phongCu.tenPhong ?? null,
          phongMoiId,
          phongMoiText,
          sucChua: sucChuaMoi,
          soNguoiDangO: soNguoiDangOMoi,
          soChoTrong: soChoTrongMoi,
          trangThaiText,
        };
      }),
    );
 
    return result;
  }

  /**
  * Đếm số người đang ở 1 phòng, cộng dồn qua TẤT CẢ hợp đồng hiệu lực (trangThai = 1)
  * gắn với phòng đó (vì 1 phòng có thể có nhiều hợp đồng cùng lúc).
  */
  private async demSoNguoiDangO(phongId?: number | null): Promise<number> {
    if (!phongId) return 0;
    return this.prisma.hopDongNguoiThue.count({
      where: {
        isDelete: false,
        hopDong: { phongId, isDelete: false, trangThai: 1 },
      },
    });
  }

  /**
   * Kiểm tra 1 phòng có đang gắn ÍT NHẤT 1 hợp đồng hiệu lực hay không.
   */
  private async coHopDongDangHieuLuc(phongId: number): Promise<boolean> {
    const count = await this.prisma.hopDong.count({
      where: { phongId, isDelete: false, trangThai: 1 },
    });
    return count > 0;
  }

  private mapTrangThaiLuanChuyen(trangThai?: number | null): string {
    switch (trangThai) {
      case 0:
        return 'Đã chuyển';
      case 1:
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
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