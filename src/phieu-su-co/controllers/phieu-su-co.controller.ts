import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhieuSuCoService } from '../services/phieu-su-co.service';
import { CreatePhieuSuCoDto, UpdatePhieuSuCoDto } from '../dto/create-phieu-su-co.dto';

@ApiTags('Phiếu Sự Cố')
@Controller('phieu-su-co')
export class PhieuSuCoController {
  constructor(private readonly service: PhieuSuCoService) {}

  @Post()
  create(@Body() dto: CreatePhieuSuCoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePhieuSuCoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}