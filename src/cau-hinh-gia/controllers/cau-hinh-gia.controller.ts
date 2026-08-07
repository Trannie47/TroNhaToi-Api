import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CauHinhGiaService } from '../services/cau-hinh-gia.service';
import { CreateCauHinhGiaDto } from '../dto/create-cau-hinh-gia.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Cấu Hình Giá')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cau-hinh-gia')
export class CauHinhGiaController {
  constructor(private readonly cauHinhGiaService: CauHinhGiaService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy cấu hình giá điện nước và giá gửi xe mới nhất' })
  getGiaHienTai() {
    return this.cauHinhGiaService.getGiaHienTai();
  }

  @Post()
  @ApiOperation({ summary: 'Cập nhật giá điện nước và giá gửi xe' })
  updateGia(@Body() dto: CreateCauHinhGiaDto) {
    return this.cauHinhGiaService.updateGia(dto);
  }

  @Get('xe/:loaiXe')
  @ApiOperation({ summary: 'Lấy giá gửi xe mặc định theo loại xe (0: Xe máy, 1: Ô tô, 2: Xe đạp)' })
  @ApiParam({ name: 'loaiXe', description: 'Loại xe: 0 = Xe máy, 1 = Ô tô, 2 = Xe đạp' })
  getGiaXeTheoLoai(@Param('loaiXe', ParseIntPipe) loaiXe: number) {
    return this.cauHinhGiaService.getGiaXeTheoLoai(loaiXe);
  }
}
