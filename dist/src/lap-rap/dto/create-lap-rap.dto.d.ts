export declare class CreateLapRapDto {
    phongId?: number;
    thietBiId?: number;
    ngayLap?: string;
    soLuong?: number;
}
declare const UpdateLapRapDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateLapRapDto>>;
export declare class UpdateLapRapDto extends UpdateLapRapDto_base {
}
export {};
