import { HoaDonGuiXeService } from '../services/hoa-don-gui-xe.service';
import { CreateHoaDonGuiXeDto } from '../dto/create-hoa-don-gui-xe.dto';
import { UpdateHoaDonGuiXeDto } from '../dto/update-hoa-don-gui-xe.dto';
export declare class HoaDonGuiXeController {
    private readonly hoaDonGuiXeService;
    constructor(hoaDonGuiXeService: HoaDonGuiXeService);
    create(dto: CreateHoaDonGuiXeDto): import(".prisma/client").Prisma.Prisma__HoaDonGuiXeClient<{
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
        bienSo: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phuongTien: {
            nguoiThue: {
                cccd: string | null;
                hoTen: string | null;
                ngaySinh: Date | null;
                sdt: string | null;
                queQuan: string | null;
                ghiChu: string | null;
                idnt: number;
            };
        } & {
            idnt: number | null;
            bienSo: string;
            hangXe: string | null;
            mauSac: string | null;
        };
    } & {
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
        bienSo: string | null;
    })[]>;
    findOne(id: number): Promise<{
        phuongTien: {
            nguoiThue: {
                cccd: string | null;
                hoTen: string | null;
                ngaySinh: Date | null;
                sdt: string | null;
                queQuan: string | null;
                ghiChu: string | null;
                idnt: number;
            };
        } & {
            idnt: number | null;
            bienSo: string;
            hangXe: string | null;
            mauSac: string | null;
        };
    } & {
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
        bienSo: string | null;
    }>;
    update(id: number, dto: UpdateHoaDonGuiXeDto): Promise<{
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
        bienSo: string | null;
    }>;
    remove(id: number): Promise<{
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
        bienSo: string | null;
    }>;
}
