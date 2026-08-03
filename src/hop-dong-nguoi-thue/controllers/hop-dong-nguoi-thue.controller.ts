import { Controller, Get, Post, Delete, Patch, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { HopDongNguoiThueService } from '../services/hop-dong-nguoi-thue.service';
import { CreateHopDongNguoiThueDto } from '../dto/create-hop-dong-nguoi-thue.dto';

@ApiTags('Hợp Đồng - Thành Viên')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hop-dong')
export class HopDongNguoiThueController {
  constructor(private readonly service: HopDongNguoiThueService) { }

  @Get(':hopDongId/thanh-vien')
  @ApiOperation({ summary: 'Lấy danh sách thành viên của hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  getMembers(@Param('hopDongId') hopDongId: string) {
    return this.service.getMembersByHopDong(hopDongId);
  }

  @Post(':hopDongId/thanh-vien')
  @ApiOperation({ summary: 'Thêm thành viên vào hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  addMember(@Param('hopDongId') hopDongId: string, @Body() dto: CreateHopDongNguoiThueDto) {
    return this.service.addMember({ ...dto, hopDongId });
  }

  @Delete(':hopDongId/thanh-vien/:idnt')
  @ApiOperation({ summary: 'Xóa thành viên khỏi hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  @ApiParam({ name: 'idnt', description: 'ID người thuê' })
  removeMember(
    @Param('hopDongId') hopDongId: string,
    @Param('idnt', ParseIntPipe) idnt: number,
  ) {
    return this.service.removeMember(hopDongId, idnt);
  }

  @Patch(':hopDongId/thanh-vien/:idnt/dai-dien')
  @ApiOperation({ summary: 'Đổi người đại diện của hợp đồng' })
  @ApiParam({ name: 'hopDongId', description: 'Mã hợp đồng' })
  @ApiParam({ name: 'idnt', description: 'ID người thuê mới làm đại diện' })
  changeRepresentative(
    @Param('hopDongId') hopDongId: string,
    @Param('idnt', ParseIntPipe) idnt: number,
  ) {
    return this.service.changeRepresentative(hopDongId, idnt);
  }
}
