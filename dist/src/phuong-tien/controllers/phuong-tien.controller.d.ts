import { PhuongTienService } from '../services/phuong-tien.service';
import { CreatePhuongTienDto } from '../dto/create-phuong-tien.dto';
import { UpdatePhuongTienDto } from '../dto/update-phuong-tien.dto';
export declare class PhuongTienController {
    private readonly phuongTienService;
    constructor(phuongTienService: PhuongTienService);
    create(dto: CreatePhuongTienDto): import(".prisma/client").Prisma.Prisma__PhuongTienClient<{
        idnt: number | null;
        bienSo: string;
        hangXe: string | null;
        mauSac: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        nguoiThue: {
            hoTen: string;
            sdt: string;
            idnt: number;
        };
        hoaDonGuiXe: {
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
            bienSo: string | null;
        }[];
    } & {
        idnt: number | null;
        bienSo: string;
        hangXe: string | null;
        mauSac: string | null;
    })[]>;
    findOne(id: string): Promise<{
        nguoiThue: {
            hoTen: string;
            sdt: string;
            idnt: number;
        };
        hoaDonGuiXe: {
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
            bienSo: string | null;
        }[];
    } & {
        idnt: number | null;
        bienSo: string;
        hangXe: string | null;
        mauSac: string | null;
    }>;
    update(id: string, dto: UpdatePhuongTienDto): Promise<{
        idnt: number | null;
        bienSo: string;
        hangXe: string | null;
        mauSac: string | null;
    }>;
    remove(id: string): Promise<{
        idnt: number | null;
        bienSo: string;
        hangXe: string | null;
        mauSac: string | null;
    }>;
}
