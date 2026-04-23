import { SuaChuaService } from '../services/sua-chua.service';
import { CreateSuaChuaDto } from '../dto/create-sua-chua.dto';
import { UpdateSuaChuaDto } from '../dto/update-sua-chua.dto';
export declare class SuaChuaController {
    private readonly suaChuaService;
    constructor(suaChuaService: SuaChuaService);
    create(dto: CreateSuaChuaDto): import(".prisma/client").Prisma.Prisma__SuaChuaClient<{
        id: number;
        phongId: number | null;
        nguyenNhan: string | null;
        ngaySuaChua: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
