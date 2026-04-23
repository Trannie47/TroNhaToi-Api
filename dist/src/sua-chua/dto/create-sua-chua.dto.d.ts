export declare class CreateSuaChuaDto {
    phongId?: number;
    nguyenNhan?: string;
    ngaySuaChua?: string;
}
declare const UpdateSuaChuaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSuaChuaDto>>;
export declare class UpdateSuaChuaDto extends UpdateSuaChuaDto_base {
}
export {};
