import { PrismaService } from '../../prisma/prisma.service';
import { CreateHoaDonPhongDto } from '../dto/create-hoa-don-phong.dto';
import { UpdateHoaDonPhongDto } from '../dto/update-hoa-don-phong.dto';
export declare class HoaDonPhongService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        hopDong: {
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
            };
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
            phongId: number | null;
            trangThai: string | null;
            idnt: number | null;
            ngayKy: Date | null;
            ngayHetHan: Date | null;
            tienCoc: import("@prisma/client/runtime/library").Decimal | null;
            giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
            hopDongId: number;
        };
        phieuThuHangThang: {
            ghiChu: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number | null;
            ngayThu: Date | null;
            maPhieuThu: number;
        }[];
    } & {
        hopDongId: number | null;
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
    })[]>;
    findOne(id: number): Promise<{
        hopDong: {
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
            };
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
            phongId: number | null;
            trangThai: string | null;
            idnt: number | null;
            ngayKy: Date | null;
            ngayHetHan: Date | null;
            tienCoc: import("@prisma/client/runtime/library").Decimal | null;
            giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
            hopDongId: number;
        };
        phieuThuHangThang: {
            ghiChu: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number | null;
            ngayThu: Date | null;
            maPhieuThu: number;
        }[];
    } & {
        hopDongId: number | null;
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
    }>;
    create(dto: CreateHoaDonPhongDto): import(".prisma/client").Prisma.Prisma__HoaDonPhongClient<{
        hopDongId: number | null;
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateHoaDonPhongDto): Promise<{
        hopDongId: number | null;
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
    }>;
    remove(id: number): Promise<{
        hopDongId: number | null;
        thangNam: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number;
    }>;
}
