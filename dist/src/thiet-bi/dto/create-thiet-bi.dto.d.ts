export declare class CreateThietBiDto {
    tenThietBi?: string;
    loai?: string;
    giaTri?: number;
    ngayMua?: string;
    trangThai?: string;
}
declare const UpdateThietBiDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateThietBiDto>>;
export declare class UpdateThietBiDto extends UpdateThietBiDto_base {
}
export {};
