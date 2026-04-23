export declare class CreateHopDongDto {
    idnt?: number;
    phongId?: number;
    ngayKy?: string;
    ngayHetHan?: string;
    tienCoc?: number;
    giaPhongThucTe?: number;
    trangThai?: string;
}
declare const UpdateHopDongDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHopDongDto>>;
export declare class UpdateHopDongDto extends UpdateHopDongDto_base {
}
export {};
