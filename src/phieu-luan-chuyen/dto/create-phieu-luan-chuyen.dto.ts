import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateChiTietLuanChuyenDto {
  @ApiProperty({
    description: 'ID hợp đồng',
  })
  @IsString()
  hopDongId: string;

  @ApiPropertyOptional({
    description: 'ID phòng mới',
  })
  @IsOptional()
  @IsInt()
  phongMoiId?: number;

  @ApiPropertyOptional({
    description: 'Từ ngày',
  })
  @IsOptional()
  @IsDateString()
  tuNgay?: string;

  @ApiPropertyOptional({
    description: 'Đến ngày',
  })
  @IsOptional()
  @IsDateString()
  denNgay?: string;

  @ApiPropertyOptional({
    description: 'Lý do luân chuyển',
  })
  @IsOptional()
  @IsString()
  lyDoLuanChuyen?: string;

  @ApiPropertyOptional({
    description: 'Chi phí',
  })
  @IsOptional()
  @IsNumber()
  chiPhi?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú',
  })
  @IsOptional()
  @IsString()
  ghiChu?: string;
}

export class UpdateChiTietLuanChuyenDto extends PartialType(
  CreateChiTietLuanChuyenDto,
) {}