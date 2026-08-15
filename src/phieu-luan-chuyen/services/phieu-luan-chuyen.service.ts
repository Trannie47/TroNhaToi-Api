import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    // =========================================================
    // 1. Lấy hợp đồng
    // =========================================================
    const hopDong = await tx.hopDong.findFirst({
      where: {
        hopDongId: dto.hopDongId,
        isDelete: false,
      },
      select: {
        hopDongId: true,
        phongId: true,
        trangThai: true,
        nguoiOGhep: {
          where: { isDelete: false },
          select: { cccd: true },
        },
      },
    });

    if (!hopDong) {
      throw new NotFoundException(
        `Không tìm thấy hợp đồng ${dto.hopDongId}`,
      );
    }

    if (hopDong.phongId == null) {
      throw new NotFoundException(
        `Hợp đồng ${dto.hopDongId} chưa có phòng`,
      );
    }

    // =========================================================
    // 2. Không cho tạo phiếu thứ 2 khi phiếu hiện tại còn hiệu lực
    // =========================================================
    const phieuDangLuanChuyen =
      await this.layPhieuDangLuanChuyen(
        tx,
        dto.hopDongId,
      );

    if (phieuDangLuanChuyen) {
      const denNgay = phieuDangLuanChuyen.denNgay;

      const ngayKetThuc = denNgay
        ? new Date(denNgay).toLocaleDateString('vi-VN')
        : null;

      const tenPhongMoi =
        phieuDangLuanChuyen.phongMoi?.tenPhong ?? 'phòng khác';

      throw new ConflictException(
        ngayKetThuc
          ? `Người thuộc hợp đồng này đang luân chuyển sang phòng ${tenPhongMoi} và còn hiệu lực đến ngày ${ngayKetThuc}. Không thể tạo phiếu luân chuyển mới.`
          : `Người thuộc hợp đồng này đang luân chuyển sang phòng ${tenPhongMoi} và chưa có ngày kết thúc. Không thể tạo phiếu luân chuyển mới.`,
      );
    }

    // =========================================================
    // 3. Phòng mới bắt buộc khác phòng gốc
    // =========================================================
    if (
      dto.phongMoiId != null &&
      dto.phongMoiId === hopDong.phongId
    ) {
      throw new ConflictException(
        'Phòng mới phải khác phòng hiện tại của hợp đồng.',
      );
    }

    // =========================================================
    // 4. Kiểm tra phòng mới tồn tại + còn đủ sức chứa cho cả hợp đồng đang chuyển
    // =========================================================
    if (dto.phongMoiId != null) {
      const phongMoi = await tx.phong.findFirst({
        where: {
          phongId: dto.phongMoiId,
          isDelete: false,
        },
        select: {
          phongId: true,
          tenPhong: true,
          trangThai: true,
          loaiPhong: { select: { soNguoiToiDa: true } },
        },
      });

      if (!phongMoi) {
        throw new NotFoundException(
          `Không tìm thấy phòng mới #${dto.phongMoiId}`,
        );
      }

      const soNguoiToiDa = phongMoi.loaiPhong?.soNguoiToiDa;
      if (soNguoiToiDa != null) {
        const soNguoiChuyenQua = 1 + hopDong.nguoiOGhep.length;
        const soNguoiDangOPhongMoi = await this.demSoNguoiDangO(
          tx,
          dto.phongMoiId,
        );

        if (soNguoiDangOPhongMoi + soNguoiChuyenQua > soNguoiToiDa) {
          const soChoConLai = Math.max(soNguoiToiDa - soNguoiDangOPhongMoi, 0);
          throw new ConflictException(
            `Phòng ${phongMoi.tenPhong} chỉ còn ${soChoConLai} chỗ trống, không đủ chỗ cho ${soNguoiChuyenQua} người của hợp đồng này.`,
          );
        }
      }
    }

    // =========================================================
    // 5. TẠO PHIẾU
    // =========================================================
    const created = await tx.phieuLuanChuyen.create({
      data: {
        hopDongId: dto.hopDongId,
        phongMoiId: dto.phongMoiId,
        tuNgay: dto.tuNgay
          ? new Date(dto.tuNgay)
          : null,
        denNgay: dto.denNgay
          ? new Date(dto.denNgay)
          : null,
        lyDoLuanChuyen: dto.lyDoLuanChuyen,
        chiPhi: dto.chiPhi,
        ghiChu: dto.ghiChu,
      },
    });

    // =========================================================
    // 6. Cập nhật lại trạng thái phòng gốc (phòng đi) và phòng mới (phòng đến)
    //    ngay trong transaction — KHÔNG dùng cron tự động.
    // =========================================================
    await this.capNhatTrangThaiPhong(tx, hopDong.phongId);

    if (
      dto.phongMoiId != null &&
      dto.phongMoiId !== hopDong.phongId
    ) {
      await this.capNhatTrangThaiPhong(tx, dto.phongMoiId);
    }

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


  private async demSoNguoiDangO(
    prisma: any,
    phongId?: number | null,
  ): Promise<number> {
    if (!phongId) {
      return 0;
    }

    const dsHopDong = await prisma.hopDong.findMany({
      where: {
        phongId,
        isDelete: false,
        trangThai: 1,
      },
      select: {
        hopDongId: true,
        nguoiOGhep: {
          where: {
            isDelete: false,
          },
          select: {
            cccd: true,
          },
        },
      },
    });

    let soNguoi = 0;

    for (const hopDong of dsHopDong) {
      soNguoi += 1 + hopDong.nguoiOGhep.length;
    }

    const homNay = this.ngayHomNayTheoLich();

    const dsLuanChuyenDen =
      await prisma.phieuLuanChuyen.findMany({
        where: {
          phongMoiId: phongId,
          isDelete: false,
          tuNgay: {
            lte: homNay,
          },
          OR: [
            {
              denNgay: null,
            },
            {
              denNgay: {
                gt: homNay,
              },
            },
          ],
        },
        include: {
          hopDong: {
            select: {
              hopDongId: true,
              isDelete: true,
              trangThai: true,
              nguoiOGhep: {
                where: {
                  isDelete: false,
                },
                select: {
                  cccd: true,
                },
              },
            },
          },
        },
      });

    for (const phieu of dsLuanChuyenDen) {
      if (
        !phieu.hopDong.isDelete &&
        phieu.hopDong.trangThai === 1
      ) {
        soNguoi += 1 + phieu.hopDong.nguoiOGhep.length;
      }
    }

    return soNguoi;
  }

  /**
   * Tự động cập nhật trạng thái 1 phòng — CHỈ được gọi từ bên trong
   * create/update/remove của phiếu luân chuyển (không có cron tự động).
   *
   * Quy tắc (so sánh theo SỐ NGƯỜI, không phải số hợp đồng):
   * 1. Lấy tổng số người thuộc các hợp đồng ĐANG HIỆU LỰC (trangThai = 1)
   *    có phongId = phòng này -> tongSoNguoiHopDong
   *    (1 người đại diện + số người ở ghép, mỗi hợp đồng).
   * 2. Trong số đó, lấy số người thuộc các hợp đồng ĐÃ CÓ phiếu luân chuyển
   *    đi CÒN HIỆU LỰC (tuNgay <= hôm nay, denNgay null hoặc >= hôm nay)
   *    -> soNguoiDaLuanChuyenDi.
   * 3. Cộng thêm số người đang được luân chuyển ĐẾN phòng này (còn hiệu lực,
   *    hợp đồng gốc của họ vẫn đang hiệu lực) -> soNguoiChuyenDen.
   *    (để phòng nhận luân chuyển cũng được cập nhật đúng, vì phòng đó có
   *    thể không có hợp đồng nào trực tiếp gắn phongId).
   *
   * soNguoiConOPhong = (tongSoNguoiHopDong - soNguoiDaLuanChuyenDi) + soNguoiChuyenDen
   *
   * - Nếu phòng không có hợp đồng nào và cũng không có ai chuyển đến
   *   -> trangThai = 0 (phòng trống, chưa từng có người).
   * - Nếu soNguoiConOPhong > 0 (còn người ở, dù là hợp đồng gốc hay do
   *   luân chuyển đến) -> trangThai = 1 (đang thuê).
   * - Nếu soNguoiConOPhong === 0 nhưng phòng có/từng có hợp đồng
   *   (tức tất cả số người thuộc hợp đồng của phòng đã luân chuyển đi hết
   *   và không có ai chuyển đến thay) -> trangThai = 2 (đang sửa).
   */
  private async capNhatTrangThaiPhong(
    tx: Prisma.TransactionClient,
    phongId: number,
  ): Promise<void> {
    const homNay = this.ngayHomNayTheoLich();

    // Hợp đồng đang hiệu lực có phongId = phòng này (phòng gốc trên hợp đồng)
    const dsHopDong = await tx.hopDong.findMany({
      where: {
        phongId,
        isDelete: false,
        trangThai: 1,
      },
      select: {
        hopDongId: true,
        nguoiOGhep: {
          where: { isDelete: false },
          select: { cccd: true },
        },
      },
    });

    const tongSoNguoiHopDong = dsHopDong.reduce(
      (sum, hd) => sum + 1 + hd.nguoiOGhep.length,
      0,
    );

    // Trong các hợp đồng trên, hợp đồng nào đang có phiếu luân chuyển đi còn hiệu lực
    const dsLuanChuyenRa = await tx.phieuLuanChuyen.findMany({
      where: {
        hopDongId: { in: dsHopDong.map((hd) => hd.hopDongId) },
        isDelete: false,
        tuNgay: { lte: homNay },
        OR: [{ denNgay: null }, { denNgay: { gt: homNay } }],
      },
      select: { hopDongId: true },
    });

    const hopDongDangLuanChuyen = new Set(
      dsLuanChuyenRa.map((item) => item.hopDongId),
    );

    const soNguoiDaLuanChuyenDi = dsHopDong
      .filter((hd) => hopDongDangLuanChuyen.has(hd.hopDongId))
      .reduce((sum, hd) => sum + 1 + hd.nguoiOGhep.length, 0);

    // Số người đang được luân chuyển ĐẾN phòng này, còn hiệu lực, hợp đồng gốc vẫn hiệu lực
    const dsLuanChuyenDen = await tx.phieuLuanChuyen.findMany({
      where: {
        phongMoiId: phongId,
        isDelete: false,
        tuNgay: { lte: homNay },
        OR: [{ denNgay: null }, { denNgay: { gt: homNay } }],
        hopDong: { isDelete: false, trangThai: 1 },
      },
      select: {
        hopDong: {
          select: {
            nguoiOGhep: {
              where: { isDelete: false },
              select: { cccd: true },
            },
          },
        },
      },
    });

    const soNguoiChuyenDen = dsLuanChuyenDen.reduce(
      (sum, lc) => sum + 1 + (lc.hopDong?.nguoiOGhep.length ?? 0),
      0,
    );

    // Phòng chưa từng có hợp đồng nào và cũng không có ai chuyển tới -> phòng trống
    if (dsHopDong.length === 0 && soNguoiChuyenDen === 0) {
      await tx.phong.update({
        where: { phongId },
        data: { trangThai: 0 },
      });
      return;
    }

    const soNguoiConOPhong =
      tongSoNguoiHopDong - soNguoiDaLuanChuyenDi + soNguoiChuyenDen;

    const trangThaiMoi = soNguoiConOPhong > 0 ? 1 : 2;

    await tx.phong.update({
      where: { phongId },
      data: { trangThai: trangThaiMoi },
    });
  }

  private async layPhieuDangLuanChuyen(
    tx: Prisma.TransactionClient,
    hopDongId: string,
  ) {
    const now = new Date();

    const homNay = new Date(
      Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ),
    );

    return await tx.phieuLuanChuyen.findFirst({
      where: {
        hopDongId,
        isDelete: false,

        tuNgay: {
          lte: homNay,
        },

        OR: [
          {
            denNgay: null,
          },
          {
            denNgay: {
              gt: homNay,
            },
          },
        ],
      },

      orderBy: {
        chiTietLuanChuyenID: 'desc',
      },

      select: {
        chiTietLuanChuyenID: true,
        tuNgay: true,
        denNgay: true,
        phongMoiId: true,
        phongMoi: {
          select: {
            tenPhong: true,
          },
        },
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

  /**
   * Danh sách phòng khác (không phải phòng hiện tại của hợp đồng) kèm tình trạng
   * chỗ trống, để chọn làm phòng mới khi luân chuyển.
   */
  async getDsPhongCoTheLuanChuyen(phongHienTaiId: number) {
    const dsPhongKhac = await this.prisma.phong.findMany({
      where: {
        isDelete: false,
        phongId: {
          not: phongHienTaiId,
        },
        trangThai: {
          not: 2,
        },
      },
      include: {
        loaiPhong: true,
      },
    });

    const result = await Promise.all(
      dsPhongKhac.map(async (p) => {
        const soNguoiDangO = await this.demSoNguoiDangO(
          this.prisma,
          p.phongId,
        );

        const sucChua = p.loaiPhong?.soNguoiToiDa ?? null;

        const soChoTrong =
          sucChua != null
            ? Math.max(sucChua - soNguoiDangO, 0)
            : null;

        const daCoHopDong =
          await this.coHopDongDangHieuLuc(p.phongId);

        return {
          phongId: p.phongId,
          tenPhong: p.tenPhong,
          sucChua,
          soNguoiDangO,
          soChoTrong,
          daCoHopDong,
        };
      }),
    );

    return result.filter(
      (p) =>
        p.soChoTrong == null ||
        p.soChoTrong > 0,
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
  const homNay = this.ngayHomNayTheoLich();

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
        {
          denNgay: null,
        },
        {
          denNgay: {
            gt: homNay,
          },
        },
      ],
    },
    include: {
      phongMoi: true,
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
    orderBy: {
      chiTietLuanChuyenID: 'desc',
    },
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


  async update(
    id: number,
    dto: UpdateChiTietLuanChuyenDto,
  ) {
    const existing = await this.prisma.phieuLuanChuyen.findFirst({
      where: {
        chiTietLuanChuyenID: id,
        isDelete: false,
      },
      include: {
        hopDong: {
          select: {
            hopDongId: true,
            phongId: true,
          },
        },
        phongMoi: {
          select: {
            phongId: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy phiếu luân chuyển #${id}`,
      );
    }

    if (
      dto.hopDongId !== undefined &&
      dto.hopDongId !== existing.hopDongId
    ) {
      throw new ConflictException(
        'Không thể đổi hợp đồng của phiếu luân chuyển hiện tại.',
      );
    }

    if (
      dto.phongMoiId !== undefined &&
      dto.phongMoiId !== existing.phongMoiId
    ) {
      throw new ConflictException(
        'Không thể đổi phòng của phiếu luân chuyển hiện tại. ' +
        'Vui lòng hoàn thành phiếu hiện tại rồi tạo phiếu mới.',
      );
    }

    const tuNgayMoi =
      dto.tuNgay !== undefined
        ? dto.tuNgay
          ? new Date(dto.tuNgay)
          : null
        : existing.tuNgay;

    const denNgayMoi =
      dto.denNgay !== undefined
        ? dto.denNgay
          ? new Date(dto.denNgay)
          : null
        : existing.denNgay;

    if (
      tuNgayMoi != null &&
      denNgayMoi != null &&
      denNgayMoi < tuNgayMoi
    ) {
      throw new ConflictException(
        'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      const updated = await tx.phieuLuanChuyen.update({
        where: {
          chiTietLuanChuyenID: id,
        },
        data: {
          ...(dto.tuNgay !== undefined && {
            tuNgay: dto.tuNgay
              ? new Date(dto.tuNgay)
              : null,
          }),

          ...(dto.denNgay !== undefined && {
            denNgay: dto.denNgay
              ? new Date(dto.denNgay)
              : null,
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

      // Cập nhật lại trạng thái phòng gốc và phòng mới ngay trong transaction
      if (existing.hopDong?.phongId != null) {
        await this.capNhatTrangThaiPhong(
          tx,
          existing.hopDong.phongId,
        );
      }

      if (
        existing.phongMoi?.phongId != null &&
        existing.phongMoi.phongId !== existing.hopDong?.phongId
      ) {
        await this.capNhatTrangThaiPhong(
          tx,
          existing.phongMoi.phongId,
        );
      }

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Cập nhật phiếu luân chuyển thành công!',
        data: updated,
      };
    });
  }
   private ngayHomNayTheoLich(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async remove(id: number) {
    const existing = await this.prisma.phieuLuanChuyen.findFirst({
      where: {
        chiTietLuanChuyenID: id,
        isDelete: false,
      },
      include: {
        hopDong: {
          select: {
            phongId: true,
          },
        },
        phongMoi: {
          select: {
            phongId: true,
          },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(
        `Không tìm thấy phiếu luân chuyển #${id}`,
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.phieuLuanChuyen.update({
        where: {
          chiTietLuanChuyenID: id,
        },
        data: {
          isDelete: true,
        },
      });

      // Cập nhật lại trạng thái phòng gốc và phòng mới ngay trong transaction
      if (existing.hopDong?.phongId != null) {
        await this.capNhatTrangThaiPhong(
          tx,
          existing.hopDong.phongId,
        );
      }

      if (
        existing.phongMoi?.phongId != null &&
        existing.phongMoi.phongId !== existing.hopDong?.phongId
      ) {
        await this.capNhatTrangThaiPhong(
          tx,
          existing.phongMoi.phongId,
        );
      }

      await this.thongKeSnapshot.invalidateAll(tx);

      return {
        success: true,
        message: 'Đã xóa phiếu luân chuyển!',
        data: null,
      };
    });
  }

}