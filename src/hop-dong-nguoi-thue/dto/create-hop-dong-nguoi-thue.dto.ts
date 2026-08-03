import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ThanhVienDto {
  @ApiProperty({ description: 'ID người thuê' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  idnt: number;

  @ApiProperty({ description: 'Là người đại diện hợp đồng' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  laDaiDien: boolean;

  @ApiPropertyOptional({ description: 'Quan hệ với đại diện (nếu không phải đại diện)' })
  @IsOptional()
  @IsString()
  quanHeVoiDaiDien?: string;
}

export class CreateHopDongNguoiThueDto {
  @ApiProperty({ description: 'Mã hợp đồng' })
  @IsString()
  hopDongId: string;

  @ApiProperty({ description: 'Danh sách thành viên', type: [ThanhVienDto] })
  @ValidateNested({ each: true })
  @Type(() => ThanhVienDto)
  danhSachThanhVien: ThanhVienDto[];
}