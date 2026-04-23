import { PrismaService } from '../../prisma/prisma.service';
import { CreateHoaDonSuaChuaDto } from '../dto/create-hoa-don-sua-chua.dto';
import { UpdateHoaDonSuaChuaDto } from '../dto/update-hoa-don-sua-chua.dto';
export declare class HoaDonSuaChuaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        suaChua: {
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
            };
        } & {
            id: number;
            phongId: number | null;
            nguyenNhan: string | null;
            ngaySuaChua: Date | null;
        };
    } & {
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        trangThai: string | null;
        loaiSua: string | null;
        ngayLapHoaDonSc: Date | null;
        suaChuaId: number | null;
        maHoaDonSc: number;
    })[]>;
    findOne(id: number): Promise<{
        suaChua: {
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
            };
        } & {
            id: number;
            phongId: number | null;
            nguyenNhan: string | null;
            ngaySuaChua: Date | null;
        };
    } & {
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        trangThai: string | null;
        loaiSua: string | null;
        ngayLapHoaDonSc: Date | null;
        suaChuaId: number | null;
        maHoaDonSc: number;
    }>;
    create(dto: CreateHoaDonSuaChuaDto): import(".prisma/client").Prisma.Prisma__HoaDonSuaChuaClient<{
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        trangThai: string | null;
        loaiSua: string | null;
        ngayLapHoaDonSc: Date | null;
        suaChuaId: number | null;
        maHoaDonSc: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateHoaDonSuaChuaDto): Promise<{
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        trangThai: string | null;
        loaiSua: string | null;
        ngayLapHoaDonSc: Date | null;
        suaChuaId: number | null;
        maHoaDonSc: number;
    }>;
    remove(id: number): Promise<{
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        trangThai: string | null;
        loaiSua: string | null;
        ngayLapHoaDonSc: Date | null;
        suaChuaId: number | null;
        maHoaDonSc: number;
    }>;
}
