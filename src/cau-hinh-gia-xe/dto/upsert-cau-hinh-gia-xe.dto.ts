import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertCauHinhGiaXeDto {
  @IsInt({ message: 'Loại xe phải là số nguyên' })
  @IsIn([0, 1, 2], { message: 'Loại xe không hợp lệ (0: Xe máy, 1: Ô tô, 2: Xe đạp)' })
  loaiXe: number;

  @IsOptional()
  @IsString({ message: 'Tên loại xe phải là chuỗi' })
  tenLoaiXe?: string;

  @IsNumber({}, { message: 'Giá mặc định phải là số' })
  @IsNotEmpty({ message: 'Giá mặc định không được để trống' })
  @Min(0, { message: 'Giá mặc định không được nhỏ hơn 0' })
  giaMacDinh: number;
}
