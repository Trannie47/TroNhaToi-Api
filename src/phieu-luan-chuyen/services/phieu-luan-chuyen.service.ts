import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { CreateChiTietLuanChuyenDto } from '../dto/create-phieu-luan-chuyen.dto';
import { UpdateChiTietLuanChuyenDto } from '../dto/update-phieu-luan-chuyen.dto';

@Injectable()
export class PhieuLuanChuyenService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshot: ThongKeSnapshotService,
  ) { }

  async create(dto: CreateChiTietLuanChuyenDto) {
    return await this.prisma.$transaction(async (tx) => {
      const created = await tx.phieuLuanChuyen.create({
        data: {
          hopDongId: dto.hopDongId,
          phongMoiId: dto.phongMoiId,
          tuNgay: dto.tuNgay ? new Date(dto.tuNgay) : null,
          denNgay: dto.denNgay ? new Date(dto.denNgay) : null,
          lyDoLuanChuyen: dto.lyDoLuanChuyen,
          chiPhi: dto.chiPhi,
          ghiChu: dto.ghiChu,
        },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Tạo phiếu luân chuyển thành công!',
        data: created,
      };
    });
  }

  async findAll() {
    const list = await this.prisma.phieuLuanChuyen.findMany({
      where: { isDelete: false },
      include: { hopDong: true, phongMoi: true },
      orderBy: { chiTietLuanChuyenID: 'desc' },
    });

    return { success: true, data: list };
  }

  async findOne(id: number) {
    const item = await this.prisma.phieuLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
      include: { hopDong: true, phongMoi: true },
    });

    if (!item) throw new NotFoundException(`Không tìm thấy phiếu luân chuyển #${id}`);

    return { success: true, data: item };
  }

  /**
   * Danh sách phiếu luân chuyển của 1 hợp đồng.
   */
  findByHopDong(hopDongId: string) {
    return this.prisma.phieuLuanChuyen.findMany({
      where: { hopDongId, isDelete: false },
      include: { phongMoi: true },
      orderBy: { chiTietLuanChuyenID: 'desc' },
    });
  }

  /**
   * Đếm số người đang ở 1 phòng, cộng dồn qua TẤT CẢ hợp đồng hiệu lực (trangThai = 1)
   * gắn với phòng đó (vì 1 phòng có thể có nhiều hợp đồng cùng lúc).
   */
  private async demSoNguoiDangO(phongId?: number | null): Promise<number> {
    if (!phongId) return 0;
    // return this.prisma.hopDongNguoiThue.count({
    //   where: {
    //     isDelete: false,
    //     hopDong: { phongId, isDelete: false, trangThai: 1 },
    //   },
    // });
    return 0;
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

  /**
   * Danh sách phòng khác (không phải phòng hiện tại của hợp đồng) kèm tình trạng
   * chỗ trống, để chọn làm phòng mới khi luân chuyển.
   */
  async getDsPhongCoTheLuanChuyen(phongHienTaiId: number) {
    const dsPhongKhac = await this.prisma.phong.findMany({
      where: { isDelete: false, phongId: { not: phongHienTaiId } },
      include: { loaiPhong: true },
    });

    return Promise.all(
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
        };
      }),
    );
  }

  /**
 * Lấy danh sách phiếu luân chuyển theo phòng cũ (phòng đang gắn trên hợp đồng).
 */
  async getLuanChuyenPhongHopDong(phongId: number) {
    const phong = await this.prisma.phong.findFirst({
      where: { phongId, isDelete: false },
    });

    if (!phong) {
      throw new NotFoundException(`Không tìm thấy phòng #${phongId}`);
    }

    const list = await this.prisma.phieuLuanChuyen.findMany({
      where: {
        isDelete: false,
        hopDong: { phongId, isDelete: false },
      },
      include: { hopDong: true, phongMoi: true },
      orderBy: { chiTietLuanChuyenID: 'desc' },
    });

    return list;
  }

  /**
  * Lấy danh sách phiếu luân chuyển theo phòng mới (phòng nhận luân chuyển tới),
  * chỉ lấy phiếu còn hiệu lực (chưa có đến ngày, hoặc đến ngày >= hôm nay),
  * mỗi phiếu "trải phẳng" theo từng người trong hợp đồng, kèm cờ isNguoiThueChinh.
  */
  async getLuanChuyenPhongMoi(phongId: number) {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const phong = await this.prisma.phong.findFirst({
      where: { phongId, isDelete: false },
    });

    if (!phong) {
      throw new NotFoundException(`Không tìm thấy phòng #${phongId}`);
    }

    const list = await this.prisma.phieuLuanChuyen.findMany({
      where: {
        isDelete: false,
        phongMoiId: phongId,
        OR: [
          { denNgay: null },
          { denNgay: { gte: homNay } },
        ],
      },
      include: {
        phongMoi: true,
        hopDong: {
          include: {
            nguoiDaiDien: true,
            nguoiOGhep: { where: { isDelete: false } },
          },
        },
      },
      orderBy: { chiTietLuanChuyenID: 'desc' },
    });

    const result = list.flatMap((phieu) => {
      const { hopDong, ...phieuRest } = phieu;
      if (!hopDong) return [];

      const { nguoiDaiDien, nguoiOGhep, ...hopDongRest } = hopDong;

      const dsNguoi = [
        ...(nguoiDaiDien && !nguoiDaiDien.isDelete
          ? [
            {
              isNguoiThueChinh: true,
              hoTen: nguoiDaiDien.hoTen,
              sdt: nguoiDaiDien.sdt,
            },
          ]
          : []),
        ...nguoiOGhep.map((ng) => ({
          isNguoiThueChinh: false,
          hoTen: ng.hoTen,
          sdt: ng.sdt,
        })),
      ];

      return dsNguoi.map((nguoi) => ({
        ...phieuRest,
        hopDong: hopDongRest,
        ...nguoi,
      }));
    });

    return result;
  }

  
  async update(id: number, dto: UpdateChiTietLuanChuyenDto) {
    const existing = await this.prisma.phieuLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy phiếu luân chuyển #${id}`);

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.phieuLuanChuyen.update({
        where: { chiTietLuanChuyenID: id },
        data: {
          ...(dto.hopDongId !== undefined && { hopDongId: dto.hopDongId }),
          ...(dto.phongMoiId !== undefined && { phongMoiId: dto.phongMoiId }),
          ...(dto.tuNgay !== undefined && {
            tuNgay: dto.tuNgay ? new Date(dto.tuNgay) : null,
          }),
          ...(dto.denNgay !== undefined && {
            denNgay: dto.denNgay ? new Date(dto.denNgay) : null,
          }),
          ...(dto.lyDoLuanChuyen !== undefined && {
            lyDoLuanChuyen: dto.lyDoLuanChuyen,
          }),
          ...(dto.chiPhi !== undefined && {
            chiPhi: dto.chiPhi,
          }),
          ...(dto.ghiChu !== undefined && {
            ghiChu: dto.ghiChu,
          }),
        },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Cập nhật phiếu luân chuyển thành công!',
        data: updated,
      };
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.phieuLuanChuyen.findFirst({
      where: { chiTietLuanChuyenID: id, isDelete: false },
    });
    if (!existing) throw new NotFoundException(`Không tìm thấy phiếu luân chuyển #${id}`);

    return await this.prisma.$transaction(async (tx) => {
      await tx.phieuLuanChuyen.update({
        where: { chiTietLuanChuyenID: id },
        data: { isDelete: true },
      });

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Đã xóa phiếu luân chuyển!',
        data: null,
      };
    });
  }
}