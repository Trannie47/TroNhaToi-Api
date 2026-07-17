import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DienNuocService } from '../services/dien-nuoc.service';
import { CreateDienNuocDto } from '../dto/create-dien-nuoc.dto';
import { UpdateDienNuocDto } from '../dto/update-dien-nuoc.dto';
import { SearchDienNuocDto } from '../dto/search-dien-nuoc.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Điện Nước')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dien-nuoc')
export class DienNuocController {
  constructor(private readonly dienNuocService: DienNuocService) {}

  // @Post()
  // @ApiOperation({ summary: 'Tạo Điện Nước mới' })
  // create(@Body() dto: CreateDienNuocDto) {
  //   return this.dienNuocService.create(dto);
  // }

  @Get('init')
  @ApiOperation({ summary: 'Danh sách Điện Nước' })
  async getInitData(
    @Query('phongId', ParseIntPipe) phongId: number,
    @Query('thangNam') thangNam: string,
  ) {
    return await this.dienNuocService.getDienNuocInitData(phongId, thangNam);
  }

}
