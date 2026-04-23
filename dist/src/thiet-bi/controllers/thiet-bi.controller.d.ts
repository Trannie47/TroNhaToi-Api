import { ThietBiService } from '../services/thiet-bi.service';
import { CreateThietBiDto } from '../dto/create-thiet-bi.dto';
import { UpdateThietBiDto } from '../dto/update-thiet-bi.dto';
export declare class ThietBiController {
    private readonly thietBiService;
    constructor(thietBiService: ThietBiService);
    create(dto: CreateThietBiDto): import(".prisma/client").Prisma.Prisma__ThietBiClient<{
        trangThai: string | null;
        tenThietBi: string | null;
        loai: string | null;
        giaTri: import("@prisma/client/runtime/library").Decimal | null;
        ngayMua: Date | null;
        thietBiId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        lapRap: ({
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
            soLuong: number | null;
            thietBiId: number | null;
            ngayLap: Date | null;
        })[];
    } & {
        trangThai: string | null;
        tenThietBi: string | null;
        loai: string | null;
        giaTri: import("@prisma/client/runtime/library").Decimal | null;
        ngayMua: Date | null;
        thietBiId: number;
    })[]>;
    findOne(id: number): Promise<{
        lapRap: ({
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
            soLuong: number | null;
            thietBiId: number | null;
            ngayLap: Date | null;
        })[];
    } & {
        trangThai: string | null;
        tenThietBi: string | null;
        loai: string | null;
        giaTri: import("@prisma/client/runtime/library").Decimal | null;
        ngayMua: Date | null;
        thietBiId: number;
    }>;
    update(id: number, dto: UpdateThietBiDto): Promise<{
        trangThai: string | null;
        tenThietBi: string | null;
        loai: string | null;
        giaTri: import("@prisma/client/runtime/library").Decimal | null;
        ngayMua: Date | null;
        thietBiId: number;
    }>;
    remove(id: number): Promise<{
        trangThai: string | null;
        tenThietBi: string | null;
        loai: string | null;
        giaTri: import("@prisma/client/runtime/library").Decimal | null;
        ngayMua: Date | null;
        thietBiId: number;
    }>;
}
