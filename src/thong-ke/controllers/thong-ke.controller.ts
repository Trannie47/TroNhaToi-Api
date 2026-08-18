import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ThongKeService } from '../services/thong-ke.service';
import { ThongKeQueryDto } from '../dto/thong-ke-query.dto';

@ApiTags('Thống Kê')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('thong-ke')
export class ThongKeController {
  constructor(
    private readonly thongKeService: ThongKeService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Thống kê Dashboard' })
  getThongKe(
    @Query() dto: ThongKeQueryDto,
  ) {
    return this.thongKeService.getThongKe(dto);
  }

  @Get('nguoi-hay-no')
  @ApiOperation({ summary: 'Danh sách người thuê hay bị nợ tiền phòng nhất (tính trên mọi kỳ), kèm phòng hiện tại' })
  @ApiQuery({ name: 'top', required: false, description: 'Số lượng người trả về, mặc định 10' })
  getNguoiHayNo(
    @Query('top', new ParseIntPipe({ optional: true })) top?: number,
  ) {
    return this.thongKeService.getNguoiHayNo(top ?? 10);
  }
}