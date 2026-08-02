import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PhongService } from '../services/phong.service';
import { CreatePhongDto } from '../dto/create-phong.dto';
import { UpdatePhongDto } from '../dto/update-phong.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Phòng')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('phong')
export class PhongController {
  constructor(private readonly phongService: PhongService) { }

  @Post()
  @ApiOperation({ summary: 'Tạo Phòng mới' })
  create(@Body() dto: CreatePhongDto) {
    return this.phongService.create(dto);
  }

  @Get('findAll')
  @ApiOperation({ summary: 'Danh sách Phòng' })
  findAll() {
    return this.phongService.findAll();
  }

  @Get('con-cho-trong')
  @ApiOperation({ summary: 'Lấy danh sách phòng còn chỗ trống, sắp xếp theo số chỗ còn lại giảm dần' })
  findPhongConChoTrong() {
    return this.phongService.findPhongConChoTrong();
  }

  @Get('thiet-bi/:thietBiId')
  @ApiOperation({ summary: 'Lấy phòng theo mã thiết bị (qua bảng lắp ráp)' })
  @ApiParam({ name: 'thietBiId', description: 'ID của thiết bị' })
  getPhongByThietBiId(@Param('thietBiId', ParseIntPipe) thietBiId: number) {
    return this.phongService.getPhongByThietBiId(thietBiId);
  }

  @Get(':phongId/getListNguoiThue')
  @ApiOperation({ summary: 'Danh sách người thuê theo ID phòng' })
  @ApiParam({ name: 'phongId', description: 'ID của Phòng' })
  async getListNguoiThueByPhongId(@Param('phongId', ParseIntPipe) phongId: number) {
    return this.phongService.getListNguoiThueByPhongId(phongId);
  }

  @Get(':phongId')
  @ApiOperation({ summary: 'Chi tiết Phòng' })
  @ApiParam({ name: 'phongId', description: 'ID của Phòng' })
  findOne(@Param('phongId', ParseIntPipe) id: number) {
    return this.phongService.findOne(id);
  }

  @Patch(':phongId')
  @ApiOperation({ summary: 'Cập nhật Phòng' })
  update(@Param('phongId', ParseIntPipe) id: number, @Body() dto: UpdatePhongDto) {
    return this.phongService.update(id, dto);
  }

  @Delete(':phongId')
  @ApiOperation({ summary: 'Xóa Phòng' })
  remove(@Param('phongId', ParseIntPipe) id: number) {
    return this.phongService.remove(id);
  }
}