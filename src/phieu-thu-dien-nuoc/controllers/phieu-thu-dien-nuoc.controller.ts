import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { PhieuThuDienNuocService } from '../services/phieu-thu-dien-nuoc.service';
import { CreatePhieuThuDienNuocDto } from '../dto/create-phieu-thu-dien-nuoc.dto';
import { UpdatePhieuThuDienNuocDto } from '../dto/update-phieu-thu-dien-nuoc.dto';
import { SearchPhieuThuDienNuocDto } from '../dto/search-phieu-thu-dien-nuoc.dto';

@ApiTags('Phiếu Thu Điện Nước')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('phieu-thu-dien-nuoc')
export class PhieuThuDienNuocController {
  constructor(
    private readonly phieuThuDienNuocService: PhieuThuDienNuocService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo Phiếu Thu Điện Nước',
  })
  create(@Body() dto: CreatePhieuThuDienNuocDto) {
    return this.phieuThuDienNuocService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Danh sách Phiếu Thu Điện Nước',
  })
  findAll() {
    return this.phieuThuDienNuocService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Tìm kiếm Phiếu Thu Điện Nước',
  })
  search(@Query() dto: SearchPhieuThuDienNuocDto) {
    return this.phieuThuDienNuocService.search(dto);
  }

  @Get('load-balance')
  @ApiOperation({
    summary: 'Lấy 15 phần tử (Load More)',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    description: 'ID cuối cùng đã tải',
  })
  getAllLoadingBalance(@Query('id') id?: string) {
    return this.phieuThuDienNuocService.getAllLoadingBalance(
      id ? Number(id) : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết Phiếu Thu Điện Nước',
  })
  @ApiParam({
    name: 'id',
    description: 'ID Phiếu Thu',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.phieuThuDienNuocService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật Phiếu Thu Điện Nước',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePhieuThuDienNuocDto,
  ) {
    return this.phieuThuDienNuocService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa Phiếu Thu Điện Nước',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.phieuThuDienNuocService.remove(id);
  }

  @Get('dien-nuoc')
  @ApiOperation({
    summary: 'Danh sách phiếu thu theo điện nước',
  })
  findByDienNuoc(
    @Query('phongId', ParseIntPipe) phongId: number,
    @Query('thangNam') thangNam: string,
    @Query('lanGhi', ParseIntPipe) lanGhi: number,
  ) {
    return this.phieuThuDienNuocService.findByDienNuoc(
      phongId,
      thangNam,
      lanGhi,
    );
  }
}