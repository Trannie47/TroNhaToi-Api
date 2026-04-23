import { ChiTietTapHoaService } from '../services/chi-tiet-tap-hoa.service';
import { CreateChiTietTapHoaDto } from '../dto/create-chi-tiet-tap-hoa.dto';
import { UpdateChiTietTapHoaDto } from '../dto/update-chi-tiet-tap-hoa.dto';
export declare class ChiTietTapHoaController {
    private readonly chiTietTapHoaService;
    constructor(chiTietTapHoaService: ChiTietTapHoaService);
    create(dto: CreateChiTietTapHoaDto): import(".prisma/client").Prisma.Prisma__ChiTietTapHoaClient<{
        maHoaDon: number | null;
        maHangHoa: number | null;
        soLuong: number | null;
        maChiTietHoaDon: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        hangHoa: {
            tenHangHoa: string | null;
            giaNhap: import("@prisma/client/runtime/library").Decimal | null;
            giaBan: import("@prisma/client/runtime/library").Decimal | null;
            maHangHoa: number;
        };
        hoaDonTapHoa: {
            idnt: number | null;
            maHoaDon: number;
            ngayBan: Date | null;
            tongTien: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        maHoaDon: number | null;
        maHangHoa: number | null;
        soLuong: number | null;
        maChiTietHoaDon: number;
    })[]>;
    findOne(id: number): Promise<{
        hangHoa: {
            tenHangHoa: string | null;
            giaNhap: import("@prisma/client/runtime/library").Decimal | null;
            giaBan: import("@prisma/client/runtime/library").Decimal | null;
            maHangHoa: number;
        };
        hoaDonTapHoa: {
            idnt: number | null;
            maHoaDon: number;
            ngayBan: Date | null;
            tongTien: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        maHoaDon: number | null;
        maHangHoa: number | null;
        soLuong: number | null;
        maChiTietHoaDon: number;
    }>;
    update(id: number, dto: UpdateChiTietTapHoaDto): Promise<{
        maHoaDon: number | null;
        maHangHoa: number | null;
        soLuong: number | null;
        maChiTietHoaDon: number;
    }>;
    remove(id: number): Promise<{
        maHoaDon: number | null;
        maHangHoa: number | null;
        soLuong: number | null;
        maChiTietHoaDon: number;
    }>;
}
