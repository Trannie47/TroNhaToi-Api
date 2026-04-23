import { PrismaService } from '../../prisma/prisma.service';
import { CreateHoaDonTapHoaDto } from '../dto/create-hoa-don-tap-hoa.dto';
import { UpdateHoaDonTapHoaDto } from '../dto/update-hoa-don-tap-hoa.dto';
export declare class HoaDonTapHoaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        nguoiThue: {
            cccd: string | null;
            hoTen: string | null;
            ngaySinh: Date | null;
            sdt: string | null;
            queQuan: string | null;
            ghiChu: string | null;
            idnt: number;
        };
        chiTietTapHoa: ({
            hangHoa: {
                tenHangHoa: string | null;
                giaNhap: import("@prisma/client/runtime/library").Decimal | null;
                giaBan: import("@prisma/client/runtime/library").Decimal | null;
                maHangHoa: number;
            };
        } & {
            maHoaDon: number | null;
            maHangHoa: number | null;
            soLuong: number | null;
            maChiTietHoaDon: number;
        })[];
        phieuThuHdTh: {
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number | null;
            ngayThu: Date | null;
            maPhieuThu: number;
            nguoiDong: string | null;
        }[];
    } & {
        idnt: number | null;
        maHoaDon: number;
        ngayBan: Date | null;
        tongTien: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    findOne(id: number): Promise<{
        nguoiThue: {
            cccd: string | null;
            hoTen: string | null;
            ngaySinh: Date | null;
            sdt: string | null;
            queQuan: string | null;
            ghiChu: string | null;
            idnt: number;
        };
        chiTietTapHoa: ({
            hangHoa: {
                tenHangHoa: string | null;
                giaNhap: import("@prisma/client/runtime/library").Decimal | null;
                giaBan: import("@prisma/client/runtime/library").Decimal | null;
                maHangHoa: number;
            };
        } & {
            maHoaDon: number | null;
            maHangHoa: number | null;
            soLuong: number | null;
            maChiTietHoaDon: number;
        })[];
        phieuThuHdTh: {
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number | null;
            ngayThu: Date | null;
            maPhieuThu: number;
            nguoiDong: string | null;
        }[];
    } & {
        idnt: number | null;
        maHoaDon: number;
        ngayBan: Date | null;
        tongTien: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    create(dto: CreateHoaDonTapHoaDto): import(".prisma/client").Prisma.Prisma__HoaDonTapHoaClient<{
        idnt: number | null;
        maHoaDon: number;
        ngayBan: Date | null;
        tongTien: import("@prisma/client/runtime/library").Decimal | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateHoaDonTapHoaDto): Promise<{
        idnt: number | null;
        maHoaDon: number;
        ngayBan: Date | null;
        tongTien: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(id: number): Promise<{
        idnt: number | null;
        maHoaDon: number;
        ngayBan: Date | null;
        tongTien: import("@prisma/client/runtime/library").Decimal | null;
    }>;
}
