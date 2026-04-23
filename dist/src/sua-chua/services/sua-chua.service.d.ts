import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuaChuaDto } from '../dto/create-sua-chua.dto';
import { UpdateSuaChuaDto } from '../dto/update-sua-chua.dto';
export declare class SuaChuaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            phongId: number;
            tenPhong: string;
        };
        hoaDonSuaChua: {
            giaTien: import("@prisma/client/runtime/library").Decimal | null;
            trangThai: string | null;
            loaiSua: string | null;
            ngayLapHoaDonSc: Date | null;
            suaChuaId: number | null;
            maHoaDonSc: number;
        }[];
    } & {
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            phongId: number;
            tenPhong: string;
        };
        hoaDonSuaChua: {
            giaTien: import("@prisma/client/runtime/library").Decimal | null;
            trangThai: string | null;
            loaiSua: string | null;
            ngayLapHoaDonSc: Date | null;
            suaChuaId: number | null;
            maHoaDonSc: number;
        }[];
    } & {
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    }>;
    create(dto: CreateSuaChuaDto): import(".prisma/client").Prisma.Prisma__SuaChuaClient<{
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateSuaChuaDto): Promise<{
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    }>;
}
