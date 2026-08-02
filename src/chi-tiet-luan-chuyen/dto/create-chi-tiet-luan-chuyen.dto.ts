import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateChiTietLuanChuyenDto {
  @ApiProperty({ description: 'ID phiếu sự cố' })
  @IsInt()
  suCoId: number;

  @ApiProperty({ description: 'ID hợp đồng' })
  @IsString()
  hopDongId: string;

  @ApiPropertyOptional({ description: 'ID phòng mới' })
  @IsOptional()
  @IsInt()
  phongMoiId?: number;

  @ApiPropertyOptional({ description: 'Ngày luân chuyển (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayLuanChuyen?: string;

  @ApiPropertyOptional({ description: 'Trạng thái luân chuyển' })
  @IsOptional()
  @IsInt()
  trangThaiLuanChuyen?: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class UpdateChiTietLuanChuyenDto extends PartialType(CreateChiTietLuanChuyenDto) {}