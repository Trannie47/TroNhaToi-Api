import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CauHinhGiaXeService } from '../services/cau-hinh-gia-xe.service';
import { UpsertCauHinhGiaXeDto } from '../dto/upsert-cau-hinh-gia-xe.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Cấu Hình Giá Xe')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cau-hinh-gia-xe')
export class CauHinhGiaXeController {
  constructor(private readonly cauHinhGiaXeService: CauHinhGiaXeService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giá gửi xe mặc định theo từng loại xe' })
  getDanhSachGia() {
    return this.cauHinhGiaXeService.getDanhSachGia();
  }

  @Get(':loaiXe')
  @ApiOperation({ summary: 'Lấy giá gửi xe mặc định theo loại xe (0: Xe máy, 1: Ô tô, 2: Xe đạp)' })
  @ApiParam({ name: 'loaiXe', description: 'Loại xe: 0 = Xe máy, 1 = Ô tô, 2 = Xe đạp' })
  getGiaTheoLoaiXe(@Param('loaiXe', ParseIntPipe) loaiXe: number) {
    return this.cauHinhGiaXeService.getGiaTheoLoaiXe(loaiXe);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới hoặc cập nhật giá gửi xe mặc định cho 1 loại xe' })
  updateGia(@Body() dto: UpsertCauHinhGiaXeDto) {
    return this.cauHinhGiaXeService.updateGia(dto);
  }
}
