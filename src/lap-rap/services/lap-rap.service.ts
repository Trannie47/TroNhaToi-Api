import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLapRapDto } from '../dto/create-lap-rap.dto';
import { UpdateLapRapDto } from '../dto/update-lap-rap.dto';
import { SearchLapRapDto } from '../dto/search-lap-rap.dto';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

@Injectable()
export class LapRapService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshotService: ThongKeSnapshotService,
  ) { }

  async taoLapRap(dto: CreateLapRapDto) {
    const phong = await this.prisma.phong.findFirst({
      where: { phongId: dto.phongId, isDelete: false },
    });
    if (!phong) {
      throw new NotFoundException(`Phòng với ID ${dto.phongId} không tồn tại`);
    }

    // Lấy thông tin Thiết bị + Lịch sử mua + Số lượng đã lắp (đếm số bản ghi, vì mỗi LapRap giờ = 1 thiết bị vật lý)
    const thietBi = await this.prisma.thietBi.findFirst({
      where: { thietBiId: dto.thietBiId, isDelete: false },
      include: {
        lichSuMua: {
          where: { isDelete: false },
          select: { soLuong: true },
        },
        laprap: {
          where: { isDelete: false },
          select: { id: true },
        },
      },
    });
    if (!thietBi) {
      throw new NotFoundException(`Thiết bị với ID ${dto.thietBiId} không tồn tại`);
    }

    const soLuongMua = thietBi.lichSuMua.reduce(
      (tong, item) => tong + (item.soLuong ?? 0),
      0,
    );
    const soLuongDaLap = thietBi.laprap.length;
    const soLuongConLai = soLuongMua - soLuongDaLap;

    // Mỗi lần tạo lắp ráp = 1 thiết bị, kiểm tra còn hàng trong kho không
    if (soLuongConLai < 1) {
      throw new BadRequestException(
        `Số lượng thiết bị trong kho không đủ! (Kho còn: ${soLuongConLai > 0 ? soLuongConLai : 0})`,
      );
    }

    const lapRapMoi = await this.prisma.$transaction(async (tx) => {
      const result = await tx.lapRap.create({
        data: {
          phongId: dto.phongId,
          thietBiId: dto.thietBiId,
          ghiChu: dto.ghiChu,
          ngayLap: dto.ngayLap ? new Date(dto.ngayLap) : new Date(),
        },
        include: {
          thietbi: true,
        },
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return result;
    });

    const { thietbi, isDelete, ...lapRapRest } = lapRapMoi;
    let thietBiTransform = null;
    if (thietbi) {
      const { thietBiId, isDelete: _, ...tbRest } = thietbi;
      thietBiTransform = {
        ...tbRest,
        thietBiID: thietBiId,
      };
    }

    return {
      ...lapRapRest,
      thietBi: thietBiTransform,
    };
  }

  findAll() {
    return this.prisma.lapRap.findMany({
      where: { isDelete: false },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.lapRap.findFirst({
      where: { id: id, isDelete: false },
    });
    if (!item) throw new NotFoundException(`LapRap với id ${id} không tồn tại`);
    return item;
  }

  async create(dto: CreateLapRapDto) {
    return this.prisma.$transaction(async (tx) => {
      const created = await tx.lapRap.create({ data: dto as any });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return created;
    });
  }

  async update(id: number, dto: UpdateLapRapDto) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.lapRap.update({
        where: { id: id },
        data: dto as any,
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return updated;
    });
  }

 async remove(id: number) {
  const lapRap = await this.prisma.lapRap.findFirst({
    where: {
      id,
      isDelete: false,
    },
    include: {
      suachua: {
        where: {
          isDelete: false,
        },
        include: {
          hoadonsuachua: true,
        },
      },
    },
  });

  if (!lapRap) {
    throw new NotFoundException(
      `LapRap với id ${id} không tồn tại`,
    );
  }

  // Kiểm tra còn lịch sử sửa chữa chưa hoàn thành
  const dangSua = lapRap.suachua.some((sc) => {
    const hoaDon =
      sc.hoadonsuachua && !sc.hoadonsuachua.isDelete
        ? sc.hoadonsuachua
        : null;

    return !hoaDon || hoaDon.trangThai === 0;
  });

  if (dangSua) {
    throw new BadRequestException(
      'Thiết bị đang có lịch sử sửa chữa chưa hoàn thành. Vui lòng hoàn thành sửa chữa trước khi xóa.',
    );
  }

  return this.prisma.$transaction(async (tx) => {
    const removed = await tx.lapRap.update({
      where: { id },
      data: {
        isDelete: true,
      },
    });

    await this.thongKeSnapshotService.invalidateAll(tx);

    return removed;
  });
}

  async search(req: SearchLapRapDto) {
    const { phongId, thietBiId, limit = 10, offset = 0, sortBy = 'id', sort = 'desc' } = req;
    const where: any = { isDelete: false };

    if (phongId !== undefined) {
      where.phongId = phongId;
    }

    if (thietBiId !== undefined) {
      where.thietBiId = thietBiId;
    }

    const [data, total] = await Promise.all([
      this.prisma.lapRap.findMany({
        where,
        orderBy: { [sortBy]: sort },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.prisma.lapRap.count({ where }),
    ]);

    return { total, data };
  }

  getAllLoadingBalance(id?: number) {
    return this.prisma.lapRap.findMany({
      where: { isDelete: false },
      orderBy: { id: 'asc' },
      take: 15,
      ...(id !== undefined && id !== null
        ? { skip: 1, cursor: { id: id } }
        : {}),
    });
  }

  async findByPhongVaThietBi(phongId?: number, thietBiId?: number) {
    const where: any = {
      isDelete: false,
    };

    if (phongId !== undefined) {
      where.phongId = phongId;
    }

    if (thietBiId !== undefined) {
      where.thietBiId = thietBiId;
    }

    const dsLapRap = await this.prisma.lapRap.findMany({
      where,
      include: {
        phong: true,
        thietbi: true,
        suachua: {
          where: { isDelete: false },
          include: { hoadonsuachua: true },
          orderBy: { ngaySuaChua: 'desc' },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return dsLapRap.map((lr) => ({
      ...lr,
      trangThai: this.tinhTrangThaiLapRap(lr.suachua),
    }));
  }

  private tinhTrangThaiLapRap(
    dsSuaChua: Array<{
      hoadonsuachua?: { isDelete: boolean; trangThai: number } | null;
    }>,
  ): number {
    for (const sc of dsSuaChua) {
      const hoaDon =
        sc.hoadonsuachua && !sc.hoadonsuachua.isDelete ? sc.hoadonsuachua : null;

      if (hoaDon?.trangThai === 3) {
        return 2; // hỏng
      }
      if (!hoaDon || hoaDon.trangThai === 0) {
        return 1; // đang sửa
      }
      // trangThai === 1 hoặc 2: coi như đã sửa xong
    }

    return 0; // bình thường
  }
}