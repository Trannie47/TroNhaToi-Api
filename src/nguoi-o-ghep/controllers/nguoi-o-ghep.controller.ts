import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NguoiOGhepService } from '../services/nguoi-o-ghep.service';
import { ThemNguoiOGhepDto } from '../dto/create-nguoi-o-ghep.dto';

@ApiTags('Hợp Đồng - Người Ở Ghép')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hop-dong')
export class NguoiOGhepController {
  constructor(private readonly service: NguoiOGhepService) { }

  @Get(':hopDongId/nguoi-o-ghep')
  @ApiOperation({ summary: 'Lấy đại diện + danh sách người ở ghép của hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  getMembers(@Param('hopDongId') hopDongId: string) {
    return this.service.getMembersByHopDong(hopDongId);
  }

  @Post(':hopDongId/nguoi-o-ghep')
  @ApiOperation({ summary: 'Thêm người ở ghép vào hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  themNguoiOGhep(@Param('hopDongId') hopDongId: string, @Body() dto: ThemNguoiOGhepDto) {
    return this.service.themNguoiOGhep({ ...dto, hopDongId });
  }

  @Delete(':hopDongId/nguoi-o-ghep/:cccd')
  @ApiOperation({ summary: 'Gỡ 1 người ở ghép khỏi hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  @ApiParam({ name: 'cccd', description: 'CCCD người ở ghép' })
  xoaNguoiOGhep(
    @Param('hopDongId') hopDongId: string,
    @Param('cccd') cccd: string,
  ) {
    return this.service.xoaNguoiOGhep(hopDongId, cccd);
  }
}
