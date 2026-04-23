export declare class CreatePhuongTienDto {
    bienSo: string;
    hangXe?: string;
    mauSac?: string;
    idnt?: number;
}
declare const UpdatePhuongTienDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePhuongTienDto>>;
export declare class UpdatePhuongTienDto extends UpdatePhuongTienDto_base {
}
export {};
