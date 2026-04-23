export declare class CreateNguoiThueDto {
    cccd?: string;
    hoTen?: string;
    ngaySinh?: string;
    sdt?: string;
    queQuan?: string;
    ghiChu?: string;
}
declare const UpdateNguoiThueDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateNguoiThueDto>>;
export declare class UpdateNguoiThueDto extends UpdateNguoiThueDto_base {
}
export {};
