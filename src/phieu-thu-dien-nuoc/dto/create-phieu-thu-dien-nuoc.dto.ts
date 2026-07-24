import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePhieuThuDienNuocDto {
  @ApiProperty({ description: 'Mã phòng' })
  @IsInt()
  phongId: number;

  @ApiProperty({ description: 'Tháng năm (MM/YYYY)' })
  @IsString()
  thangNam: string;

  @ApiProperty({ description: 'Lần ghi' })
  @IsInt()
  lanGhi: number;

  @ApiPropertyOptional({ description: 'Ngày thu (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayThu?: string;

  @ApiProperty({ description: 'Số tiền thu' })
  @IsNumber()
  soTien: number;

  @ApiPropertyOptional({ description: 'Ghi chú' })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class UpdatePhieuThuDienNuocDto extends PartialType(
  CreatePhieuThuDienNuocDto,
) {}