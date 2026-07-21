import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLapRapDto } from '../dto/create-lap-rap.dto';
import { UpdateLapRapDto } from '../dto/update-lap-rap.dto';
import { SearchLapRapDto } from '../dto/search-lap-rap.dto';

@Injectable()
export class LapRapService {
  constructor(private prisma: PrismaService) {}

  async taoLapRap(dto: CreateLapRapDto) {
    const phong = await this.prisma.phong.findFirst({
      where: { phongId: dto.phongId, isDelete: false },
    });
    if (!phong) {
      throw new NotFoundException(`Phòng với ID ${dto.phongId} không tồn tại`);
    }
    //Lấy thông tin Thiết bị + Lịch sử mua + Lắp ráp hiện tại
    const thietBi = await this.prisma.thietBi.findFirst({
      where: { thietBiId: dto.thietBiId, isDelete: false },
      include: {
        lichSuMua: {
          where: { isDelete: false },
          select: { soLuong: true },
        },
        laprap: {
          where: { isDelete: false },
          select: { soLuong: true },
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

    const soLuongDaLap = thietBi.laprap.reduce(
      (tong, item) => tong + (item.soLuong ?? 0),
      0,
    );

    const soLuongConLai = soLuongMua - soLuongDaLap;
    const soLuongCanLap = dto.soLuong ?? 1;

    //Check nếu vượt quá tồn kho
    if (soLuongCanLap > soLuongConLai) {
      const conLaiText = soLuongConLai > 0 ? soLuongConLai : 0;
      throw new BadRequestException(
        `Số lượng thiết bị trong kho không đủ! (Kho còn: ${conLaiText}, Yêu cầu: ${soLuongCanLap})`,
      );
    }
    const lapRapMoi = await this.prisma.lapRap.create({
      data: {
        phongId: dto.phongId,
        thietBiId: dto.thietBiId,
        soLuong: dto.soLuong ?? 1,
        ngayLap: dto.ngayLap ? new Date(dto.ngayLap) : new Date(),
      },
      include: {
        thietbi: true,
      },
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
      //include: { phong: { select: { phongId: true, tenPhong: true } }, thietBi: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.lapRap.findFirst({
      where: { id: id, isDelete: false },
      //include: { phong: { select: { phongId: true, tenPhong: true } }, thietBi: true },
    });
    if (!item) throw new NotFoundException(`LapRap với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreateLapRapDto) {
    return this.prisma.lapRap.create({ data: dto as any });
  }

  async update(id: number, dto: UpdateLapRapDto) {
    await this.findOne(id);
    return this.prisma.lapRap.update({ where: { id: id }, data: dto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.lapRap.update({ where: { id: id }, data: { isDelete: true } });
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

}
