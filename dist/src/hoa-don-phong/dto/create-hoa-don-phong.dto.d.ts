export declare class CreateHoaDonPhongDto {
    thangNam?: string;
    soTien?: number;
    hopDongId?: number;
}
declare const UpdateHoaDonPhongDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHoaDonPhongDto>>;
export declare class UpdateHoaDonPhongDto extends UpdateHoaDonPhongDto_base {
}
export {};
