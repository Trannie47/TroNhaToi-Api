import { HopDongService } from '../services/hop-dong.service';
import { CreateHopDongDto } from '../dto/create-hop-dong.dto';
import { UpdateHopDongDto } from '../dto/update-hop-dong.dto';
export declare class HopDongController {
    private readonly hopDongService;
    constructor(hopDongService: HopDongService);
    create(dto: CreateHopDongDto): import(".prisma/client").Prisma.Prisma__HopDongClient<{
        phongId: number | null;
        trangThai: string | null;
        idnt: number | null;
        ngayKy: Date | null;
        ngayHetHan: Date | null;
        tienCoc: import("@prisma/client/runtime/library").Decimal | null;
        giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
        hopDongId: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            loaiPhong: {
                dienTich: number | null;
                isMayLanh: boolean | null;
                soNguoiToiDa: number | null;
                giaTien: import("@prisma/client/runtime/library").Decimal | null;
                maLoaiPhong: number;
            };
        } & {
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
        hoaDonPhong: {
            hopDongId: number | null;
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
        }[];
    } & {
        phongId: number | null;
        trangThai: string | null;
        idnt: number | null;
        ngayKy: Date | null;
        ngayHetHan: Date | null;
        tienCoc: import("@prisma/client/runtime/library").Decimal | null;
        giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
        hopDongId: number;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            loaiPhong: {
                dienTich: number | null;
                isMayLanh: boolean | null;
                soNguoiToiDa: number | null;
                giaTien: import("@prisma/client/runtime/library").Decimal | null;
                maLoaiPhong: number;
            };
        } & {
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
        hoaDonPhong: {
            hopDongId: number | null;
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
        }[];
    } & {
        phongId: number | null;
        trangThai: string | null;
        idnt: number | null;
        ngayKy: Date | null;
        ngayHetHan: Date | null;
        tienCoc: import("@prisma/client/runtime/library").Decimal | null;
        giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
        hopDongId: number;
    }>;
    update(id: number, dto: UpdateHopDongDto): Promise<{
        phongId: number | null;
        trangThai: string | null;
        idnt: number | null;
        ngayKy: Date | null;
        ngayHetHan: Date | null;
        tienCoc: import("@prisma/client/runtime/library").Decimal | null;
        giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
        hopDongId: number;
    }>;
    remove(id: number): Promise<{
        phongId: number | null;
        trangThai: string | null;
        idnt: number | null;
        ngayKy: Date | null;
        ngayHetHan: Date | null;
        tienCoc: import("@prisma/client/runtime/library").Decimal | null;
        giaPhongThucTe: import("@prisma/client/runtime/library").Decimal | null;
        hopDongId: number;
    }>;
}
