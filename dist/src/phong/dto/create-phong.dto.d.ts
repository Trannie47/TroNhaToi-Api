export declare class CreatePhongDto {
    tenPhong?: string;
    trangThai?: string;
    moTa?: string;
    maLoaiPhong?: number;
}
declare const UpdatePhongDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePhongDto>>;
export declare class UpdatePhongDto extends UpdatePhongDto_base {
}
export {};
