import { PrismaService } from '../../prisma/prisma.service';
import { CreatePhieuThuHdThDto } from '../dto/create-phieu-thu-hdth.dto';
import { UpdatePhieuThuHdThDto } from '../dto/update-phieu-thu-hdth.dto';
export declare class PhieuThuHdThService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        hoaDonTapHoa: {
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
            maHoaDon: number;
            ngayBan: Date | null;
            tongTien: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
        nguoiDong: string | null;
    })[]>;
    findOne(id: number): Promise<{
        hoaDonTapHoa: {
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
            maHoaDon: number;
            ngayBan: Date | null;
            tongTien: import("@prisma/client/runtime/library").Decimal | null;
        };
    } & {
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
        nguoiDong: string | null;
    }>;
    create(dto: CreatePhieuThuHdThDto): import(".prisma/client").Prisma.Prisma__PhieuThuHdThClient<{
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
        nguoiDong: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdatePhieuThuHdThDto): Promise<{
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
        nguoiDong: string | null;
    }>;
    remove(id: number): Promise<{
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
        nguoiDong: string | null;
    }>;
}
