import { LapRapService } from '../services/lap-rap.service';
import { CreateLapRapDto } from '../dto/create-lap-rap.dto';
import { UpdateLapRapDto } from '../dto/update-lap-rap.dto';
export declare class LapRapController {
    private readonly lapRapService;
    constructor(lapRapService: LapRapService);
    create(dto: CreateLapRapDto): import(".prisma/client").Prisma.Prisma__LapRapClient<{
        id: number;
        phongId: number | null;
        soLuong: number | null;
        thietBiId: number | null;
        ngayLap: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            phongId: number;
            tenPhong: string;
        };
        thietBi: {
            trangThai: string | null;
            tenThietBi: string | null;
            loai: string | null;
            giaTri: import("@prisma/client/runtime/library").Decimal | null;
            ngayMua: Date | null;
            thietBiId: number;
        };
    } & {
        id: number;
        phongId: number | null;
        soLuong: number | null;
        thietBiId: number | null;
        ngayLap: Date | null;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            phongId: number;
            tenPhong: string;
        };
        thietBi: {
            trangThai: string | null;
            tenThietBi: string | null;
            loai: string | null;
            giaTri: import("@prisma/client/runtime/library").Decimal | null;
            ngayMua: Date | null;
            thietBiId: number;
        };
    } & {
        id: number;
        phongId: number | null;
        soLuong: number | null;
        thietBiId: number | null;
        ngayLap: Date | null;
    }>;
    update(id: number, dto: UpdateLapRapDto): Promise<{
        id: number;
        phongId: number | null;
        soLuong: number | null;
        thietBiId: number | null;
        ngayLap: Date | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        phongId: number | null;
        soLuong: number | null;
        thietBiId: number | null;
        ngayLap: Date | null;
    }>;
}
