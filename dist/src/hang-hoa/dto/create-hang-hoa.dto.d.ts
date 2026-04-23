export declare class CreateHangHoaDto {
    tenHangHoa?: string;
    giaNhap?: number;
    giaBan?: number;
}
declare const UpdateHangHoaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHangHoaDto>>;
export declare class UpdateHangHoaDto extends UpdateHangHoaDto_base {
}
export {};
