import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NguoiOGhepInputDto {
  @ApiProperty({ description: 'CCCD người ở ghép' })
  @IsString()
  cccd: string;

  @ApiPropertyOptional({ description: 'Họ tên' })
  @IsOptional()
  @IsString()
  hoTen?: string;

  @ApiPropertyOptional({ description: 'Số điện thoại' })
  @IsOptional()
  @IsString()
  sdt?: string;

  @ApiPropertyOptional({ description: 'Quan hệ với đại diện' })
  @IsOptional()
  @IsString()
  quanHeVoiDaiDien?: string;
}

export class ThemNguoiOGhepDto {
  @ApiProperty({ description: 'Mã hợp đồng' })
  @IsString()
  hopDongId: string;

  @ApiProperty({ description: 'Danh sách người ở ghép cần thêm', type: [NguoiOGhepInputDto] })
  @ValidateNested({ each: true })
  @Type(() => NguoiOGhepInputDto)
  danhSachNguoiOGhep: NguoiOGhepInputDto[];
}
