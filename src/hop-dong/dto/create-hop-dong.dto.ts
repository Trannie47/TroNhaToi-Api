import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';

export class HopDongThanhVienDto {
  @ApiProperty({ description: 'ID người thuê' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  idnt: number;

  @ApiProperty({ description: 'Có phải người đại diện hay không' })
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  laDaiDien: boolean;

  @ApiPropertyOptional({ description: 'Quan hệ với người đại diện' })
  @IsOptional()
  @IsString()
  quanHeVoiDaiDien?: string;
}

export class CreateHopDongDto {
  @ApiProperty({ description: 'ID phòng' })
    @Transform(({ value }) => Number(value))
  @IsInt()
  phongId: number;

  @ApiPropertyOptional({ description: 'Danh sách thành viên hợp đồng', type: [HopDongThanhVienDto] })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
    @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => HopDongThanhVienDto)
  @ArrayMinSize(1)
  danhSachThanhVien?: HopDongThanhVienDto[];

  @ApiPropertyOptional({ description: 'Ngày ký (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayKy: string;

  @ApiPropertyOptional({ description: 'Ngày hết hạn (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  ngayHetHan: string;

  @ApiPropertyOptional({ description: 'Tiền cọc' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  tienCoc: number;

  @ApiPropertyOptional({ description: 'Giá phòng thực tế' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  giaPhongThucTe: number;

  @ApiPropertyOptional({ description: 'Trạng thái (0: Khởi tạo, 1: Đang hiệu lực, 2: Hết hiệu lực)' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  @Max(2)
  trangThai: number;

  @ApiPropertyOptional({ description: 'Ghi chú hợp đồng' })
  @IsOptional()
  @IsString()
  ghiChu?: string
}

export class UpdateHopDongDto extends PartialType(CreateHopDongDto) {}