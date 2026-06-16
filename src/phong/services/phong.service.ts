import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhongDto } from '../dto/create-phong.dto';
import { UpdatePhongDto } from '../dto/update-phong.dto';

@Injectable()
export class PhongService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const dsPhong= await this.prisma.phong.findMany({
      where: { isDelete: false },
      include: 
      { 
        loaiPhong: true, 
        HopDong: { 
          where: { isDelete: false },
         }
      },
    });
    return dsPhong.map((p)=>{
      const phong = p as any;
      let giahientai= 0;
      if(phong.HopDong && phong.HopDong.length>0)
        {
          giahientai= phong.HopDong.reduce((sum, hd)=> sum+ (hd.giaPhongThucTe || 0),0 );
        }
        else{
          giahientai= phong.loaiPhong?.giaTien || 0;
        }
        return{
          ...phong,
          giahientai,
        }
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.phong.findUnique({
      where: { phongId: id },
      // include: { loaiPhong: true, hopDong: { include: { nguoiThue: true } }, dienNuoc: true, lapRap: { include: { thietBi: true } }, nguoiLuuTruTamThoi: true },
    });
    if (!item) throw new NotFoundException(`Phong với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreatePhongDto) {
    return this.prisma.phong.create({ data: dto as any });
  }

  async update(id: number, dto: UpdatePhongDto) {
    await this.findOne(id);
    return this.prisma.phong.update({ where: { phongId: id }, data: dto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.phong.delete({ where: { phongId: id } });
  }
}
