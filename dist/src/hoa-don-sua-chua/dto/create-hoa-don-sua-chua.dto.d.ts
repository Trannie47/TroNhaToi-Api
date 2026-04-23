export declare class CreateHoaDonSuaChuaDto {
    trangThai?: string;
    giaTien?: number;
    loaiSua?: string;
    ngayLapHoaDonSc?: string;
    suaChuaId?: number;
}
declare const UpdateHoaDonSuaChuaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHoaDonSuaChuaDto>>;
export declare class UpdateHoaDonSuaChuaDto extends UpdateHoaDonSuaChuaDto_base {
}
export {};
