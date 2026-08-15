import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

export class CreateHopDongDto {
  @ApiProperty({ description: 'ID phòng' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  phongId: number;

  @ApiProperty({ description: 'ID người thuê đứng đại diện hợp đồng' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  idntDaiDien: number;

  @ApiPropertyOptional({
    description:
      'Danh sách người ở ghép (JSON string do FE gửi lên, service tự parse & validate). Mỗi phần tử: { cccd, hoTen, sdt, quanHeVoiDaiDien }',
  })
  @IsOptional()
  danhSachNguoiOGhep?: any;

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
  ghiChu?: string;

  @ApiPropertyOptional({
    description: 'Hình thức ở (false: ở ghép, true: ở một mình)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true' || value === '1' || value === 1) return true;
    if (value === 'false' || value === '0' || value === 0) return false;
    return value;
  })
  @IsBoolean()
  hinhThucO?: boolean;
}

export class UpdateHopDongDto extends PartialType(CreateHopDongDto) {}