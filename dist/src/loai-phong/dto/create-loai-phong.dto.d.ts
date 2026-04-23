export declare class CreateLoaiPhongDto {
    dienTich?: number;
    isMayLanh?: boolean;
    soNguoiToiDa?: number;
    giaTien?: number;
}
declare const UpdateLoaiPhongDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLoaiPhongDto>>;
export declare class UpdateLoaiPhongDto extends UpdateLoaiPhongDto_base {
}
export {};
