export interface PhongHopDongDto {
  phongId: number | null;
  phongCuText: string | null;
  phongMoiText: string | null;
  sucChua: number | null;
  soNguoiDangO: number;
  soChoTrong: number | null;
  trangThaiText: string;
}
 
export interface HopDongLuanChuyenDto {
  maHopDong: string;
  tenNguoiDaiDien: string | null;
  soThanhVien: number;
  dsThanhVien: string[];
  dsPhongHopDong: PhongHopDongDto[];
}
 