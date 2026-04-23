export declare class CreatePhieuThuHangThangDto {
    ngayThu?: string;
    soTien?: number;
    ghiChu?: string;
    maHoaDon?: number;
}
declare const UpdatePhieuThuHangThangDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePhieuThuHangThangDto>>;
export declare class UpdatePhieuThuHangThangDto extends UpdatePhieuThuHangThangDto_base {
}
export {};
