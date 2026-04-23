import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNguoiThueDto } from '../dto/create-nguoi-thue.dto';
import { UpdateNguoiThueDto } from '../dto/update-nguoi-thue.dto';

@Injectable()
export class NguoiThueService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.nguoiThue.findMany({
      include: { hopDong: { include: { phong: true } }, phuongTien: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.nguoiThue.findUnique({
      where: { idnt: id },
      include: { hopDong: { include: { phong: true } }, phuongTien: true },
    });
    if (!item) throw new NotFoundException(`NguoiThue với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreateNguoiThueDto) {
    return this.prisma.nguoiThue.create({ data: dto as any });
  }

  async update(id: number, dto: UpdateNguoiThueDto) {
    await this.findOne(id);
    return this.prisma.nguoiThue.update({ where: { idnt: id }, data: dto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.nguoiThue.delete({ where: { idnt: id } });
  }
}
