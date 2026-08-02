import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePhieuSuCoDto {
  @ApiPropertyOptional({ description: 'ID phòng' })
  @IsOptional()
  @IsInt()
  phongId?: number;

  @ApiPropertyOptional({ description: 'Tên sự cố' })
  @IsOptional()
  @IsString()
  tenSuCo?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  ghiChu?: string;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayBatDau?: string;

  @ApiPropertyOptional({ description: 'Ngày hoàn thành (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayHoanThanh?: string;

  @ApiPropertyOptional({ description: 'Trạng thái thông báo' })
  @IsOptional()
  @IsInt()
  trangThaiThongBao?: number;

  @ApiPropertyOptional({ description: 'Chi phí' })
  @IsOptional()
  @IsNumber()
  chiPhi?: number;
}

export class UpdatePhieuSuCoDto extends PartialType(CreatePhieuSuCoDto) {}