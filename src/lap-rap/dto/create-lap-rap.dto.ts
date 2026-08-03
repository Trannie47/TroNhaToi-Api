import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLapRapDto {
  @ApiPropertyOptional({ description: 'ID phòng' })
  @IsOptional()
  @IsInt()
  phongId?: number;

  @ApiPropertyOptional({ description: 'ID thiết bị' })
  @IsOptional()
  @IsInt()
  thietBiId?: number;

  @ApiPropertyOptional({ description: 'Ngày lắp (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayLap?: string;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class UpdateLapRapDto extends PartialType(CreateLapRapDto) {}