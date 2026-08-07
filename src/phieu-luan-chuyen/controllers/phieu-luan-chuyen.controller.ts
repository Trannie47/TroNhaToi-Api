import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhieuLuanChuyenService } from '../services/phieu-luan-chuyen.service';
import { CreateChiTietLuanChuyenDto } from '../dto/create-phieu-luan-chuyen.dto';
import { UpdateChiTietLuanChuyenDto } from '../dto/update-phieu-luan-chuyen.dto';

@ApiTags('Chi Tiết Luân Chuyển')
@Controller('phieu-luan-chuyen')
export class PhieuLuanChuyenController {
  constructor(private readonly service: PhieuLuanChuyenService) { }

  @Post()
  create(@Body() dto: CreateChiTietLuanChuyenDto) {
    return this.service.create(dto);
  }

  @Get('findall')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChiTietLuanChuyenDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}