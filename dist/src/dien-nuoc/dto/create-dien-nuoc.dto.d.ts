export declare class CreateDienNuocDto {
    phongId?: number;
    thangNam?: string;
    chiSoDien?: number;
    chiSoNuoc?: number;
}
declare const UpdateDienNuocDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDienNuocDto>>;
export declare class UpdateDienNuocDto extends UpdateDienNuocDto_base {
}
export {};
