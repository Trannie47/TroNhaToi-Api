import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhieuThuDienNuocDto } from '../dto/create-phieu-thu-dien-nuoc.dto';
import { UpdatePhieuThuDienNuocDto } from '../dto/update-phieu-thu-dien-nuoc.dto';
import { SearchPhieuThuDienNuocDto } from '../dto/search-phieu-thu-dien-nuoc.dto';

@Injectable()
export class PhieuThuDienNuocService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.phieuThuDienNuoc.findMany({
      where: {
        isDelete: false,
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
      orderBy: {
        phieuThuDienNuocId: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.phieuThuDienNuoc.findFirst({
      where: {
        phieuThuDienNuocId: id,
        isDelete: false,
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(
        `Phiếu thu điện nước ${id} không tồn tại`,
      );
    }

    return item;
  }

  async create(dto: CreatePhieuThuDienNuocDto) {
    const dienNuoc = await this.prisma.dienNuoc.findUnique({
      where: {
        phongId_thangNam_lanGhi: {
          phongId: dto.phongId,
          thangNam: dto.thangNam,
          lanGhi: dto.lanGhi,
        },
      },
      include: {
        phieuThuDienNuoc: true,
      },
    });

    if (!dienNuoc) {
      throw new NotFoundException(
        'Không tìm thấy bản ghi điện nước.',
      );
    }

    if (dienNuoc.phieuThuDienNuoc) {
      throw new BadRequestException(
        'Điện nước này đã có phiếu thu.',
      );
    }

    return this.prisma.phieuThuDienNuoc.create({
      data: {
        phongId: dto.phongId,
        thangNam: dto.thangNam,
        lanGhi: dto.lanGhi,
        ngayThu: dto.ngayThu
          ? new Date(dto.ngayThu)
          : new Date(),
        soTien: dto.soTien,
        ghiChu: dto.ghiChu,
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
    });
  }

  async update(
    id: number,
    dto: UpdatePhieuThuDienNuocDto,
  ) {
    await this.findOne(id);

    return this.prisma.phieuThuDienNuoc.update({
      where: {
        phieuThuDienNuocId: id,
      },
      data: {
        ...(dto.phongId !== undefined && {
          phongId: dto.phongId,
        }),
        ...(dto.thangNam !== undefined && {
          thangNam: dto.thangNam,
        }),
        ...(dto.lanGhi !== undefined && {
          lanGhi: dto.lanGhi,
        }),
        ...(dto.soTien !== undefined && {
          soTien: dto.soTien,
        }),
        ...(dto.ghiChu !== undefined && {
          ghiChu: dto.ghiChu,
        }),
        ...(dto.ngayThu
          ? {
            ngayThu: new Date(dto.ngayThu),
          }
          : {}),
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.phieuThuDienNuoc.update({
      where: {
        phieuThuDienNuocId: id,
      },
      data: {
        isDelete: true,
      },
    });
  }

  // Các field hợp lệ để sort trực tiếp trên PhieuThuDienNuoc.
  // Tránh truyền thẳng sortBy của client vào orderBy vì Prisma sẽ throw
  // nếu field không tồn tại hoặc là field lồng dạng "a.b".
  private static readonly SORTABLE_FIELDS = new Set([
    'phieuThuDienNuocId',
    'ngayThu',
    'soTien',
    'thangNam',
    'lanGhi',
  ]);

  async search(req: SearchPhieuThuDienNuocDto) {
    const {
      ma,
      limit = 10,
      offset = 0,
      sortBy = 'phieuThuDienNuocId',
      sort = 'desc',
    } = req;

    const where: any = {
      isDelete: false,
    };

    if (ma) {
      where.OR = [
        {
          thangNam: {
            contains: ma,
          },
        },
        {
          // PhieuThuDienNuoc không có relation "phong" trực tiếp,
          // phải đi qua "dienNuoc" trước.
          dienNuoc: {
            phong: {
              tenPhong: {
                contains: ma,
              },
            },
          },
        },
      ];
    }

    const safeSortBy = PhieuThuDienNuocService.SORTABLE_FIELDS.has(sortBy)
      ? sortBy
      : 'phieuThuDienNuocId';

    const [data, total] = await Promise.all([
      this.prisma.phieuThuDienNuoc.findMany({
        where,
        include: {
          dienNuoc: {
            include: {
              phong: true,
            },
          },
        },
        orderBy: {
          [safeSortBy]: sort,
        },
        take: Number(limit),
        skip: Number(offset),
      }),

      this.prisma.phieuThuDienNuoc.count({
        where,
      }),
    ]);

    return {
      total,
      data,
    };
  }

  getAllLoadingBalance(id?: number) {
    return this.prisma.phieuThuDienNuoc.findMany({
      where: {
        isDelete: false,
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
      orderBy: {
        phieuThuDienNuocId: 'asc',
      },
      take: 15,
      ...(id !== undefined && id !== null
        ? {
          skip: 1,
          cursor: {
            phieuThuDienNuocId: id,
          },
        }
        : {}),
    });
  }

  async findByDienNuoc(
    phongId: number,
    thangNam: string,
    lanGhi: number,
  ) {
    const item = await this.prisma.phieuThuDienNuoc.findFirst({
      where: {
        phongId,
        thangNam,
        lanGhi,
        isDelete: false,
      },
      include: {
        dienNuoc: {
          include: {
            phong: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Không tìm thấy phiếu thu điện nước.',
      );
    }

    return item;
  }
}