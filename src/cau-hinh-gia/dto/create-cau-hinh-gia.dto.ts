import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCauHinhGiaDto {
  @IsNumber({}, { message: 'Giá điện phải là số' })
  @IsNotEmpty({ message: 'Giá điện không được để trống' })
  @Min(0, { message: 'Giá điện không được nhỏ hơn 0' })
  giaDien: number;

  @IsNumber({}, { message: 'Giá nước phải là số' })
  @IsNotEmpty({ message: 'Giá nước không được để trống' })
  @Min(0, { message: 'Giá nước không được nhỏ hơn 0' })
  giaNuoc: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giá gửi xe máy phải là số' })
  @Min(0, { message: 'Giá gửi xe máy không được nhỏ hơn 0' })
  giaXeMay?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giá gửi ô tô phải là số' })
  @Min(0, { message: 'Giá gửi ô tô không được nhỏ hơn 0' })
  giaXeHoi?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Giá gửi xe đạp phải là số' })
  @Min(0, { message: 'Giá gửi xe đạp không được nhỏ hơn 0' })
  giaXeDap?: number;
}
