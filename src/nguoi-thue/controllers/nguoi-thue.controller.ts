import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NguoiThueService } from '../services/nguoi-thue.service';
import { CreateNguoiThueDto } from '../dto/create-nguoi-thue.dto';
import { UpdateNguoiThueDto } from '../dto/update-nguoi-thue.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Người Thuê')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('nguoi-thue')
export class NguoiThueController {
  constructor(private readonly nguoiThueService: NguoiThueService) { }

  @Post('create')
  @ApiOperation({ summary: 'Tạo Người Thuê mới' })
  create(@Body() dto: CreateNguoiThueDto) {
    return this.nguoiThueService.create(dto);
  }

  @Get('findall')
  @ApiOperation({ summary: 'Danh sách tất cả Người Thuê (bao gồm người mới thêm chưa có hợp đồng)' })
  findAllNguoiThue() {
    return this.nguoiThueService.findAllNguoiThue();
  }

    @Get('nguoiThueAvailableForContract')
  @ApiOperation({ summary: 'Lấy danh sách người đủ 18 tuổi để làm đại diện hợp đồng' })
  @ApiQuery({
    name: 'ngayKy',
    required: false,
    description: 'Ngày bắt đầu hợp đồng dùng để tính tuổi, định dạng YYYY-MM-DD',
  })
  async getNguoiThueAvailableForContract(@Query('ngayKy') ngayKy?: string) {
    return this.nguoiThueService.getNguoiThueAvailableForRepresentative(ngayKy);
  }

  @Get('available-representatives')
  @ApiOperation({ summary: 'Lấy danh sách người đủ điều kiện làm đại diện hợp đồng' })
  @ApiQuery({
    name: 'ngayKy',
    required: false,
    description: 'Ngày bắt đầu hợp đồng dùng để tính tuổi, định dạng YYYY-MM-DD',
  })
  getAvailableRepresentatives(@Query('ngayKy') ngayKy?: string) {
    return this.nguoiThueService.getNguoiThueAvailableForRepresentative(ngayKy);
  }


  @Get(':idnt/listRoomNguoiThue')
  @ApiOperation({ summary: 'Chi tiết Người Thuê' })
  @ApiParam({ name: 'idnt', description: 'ID của Người Thuê' })
  findRoom_NguoiThue(@Param('idnt', ParseIntPipe) id: number) {
    return this.nguoiThueService.findRoom_NguoiThue(id);
  }

  @Patch(':idnt')
  @ApiOperation({ summary: 'Cập nhật Người Thuê' })
  update(@Param('idnt', ParseIntPipe) id: number, @Body() dto: UpdateNguoiThueDto) {
    return this.nguoiThueService.update(id, dto);
  }

  @Delete(':idnt')
  @ApiOperation({ summary: 'Xóa Người Thuê' })
  remove(@Param('idnt', ParseIntPipe) id: number) {
    return this.nguoiThueService.remove(id);
  }

  @Get('cong-no-tap-hoa')
  @ApiOperation({
    summary: 'Lấy danh sách người thuê còn công nợ tạp hóa',
  })
  getNguoiThueCongNoTapHoa() {
    return this.nguoiThueService.getNguoiThueCongNoTapHoa();
  }

  @Get('luan-chuyen-trong-phong')
  @ApiOperation({ summary: 'Lấy danh sách người thuê đang luân chuyển (chưa hoàn thành) theo phòng' })
  @ApiQuery({
    name: 'phongId',
    required: true,
    description: 'ID phòng cần lấy danh sách người thuê đang luân chuyển',
    type: Number,
  })
  getNguoiThueLuanChuyenTrongPhong(@Query('phongId', ParseIntPipe) phongId: number) {
    return this.nguoiThueService.getNguoiThueLuanChuyenTrongPhong(phongId);
  }
  
}
