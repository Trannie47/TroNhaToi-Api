import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateChiTietLuanChuyenInlineDto {
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

  @ApiPropertyOptional({
    description: 'Danh sách chi tiết luân chuyển đi kèm (nếu có). Mỗi lần tạo/sửa phiếu sự cố kèm chi tiết luân chuyển sẽ ghi thêm bản ghi mới.',
    type: [CreateChiTietLuanChuyenInlineDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChiTietLuanChuyenInlineDto)
  chiTietLuanChuyen?: CreateChiTietLuanChuyenInlineDto[];
}

export class UpdatePhieuSuCoDto extends PartialType(CreatePhieuSuCoDto) {}