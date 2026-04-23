import { PhongService } from '../services/phong.service';
import { CreatePhongDto } from '../dto/create-phong.dto';
import { UpdatePhongDto } from '../dto/update-phong.dto';
export declare class PhongController {
    private readonly phongService;
    constructor(phongService: PhongService);
    create(dto: CreatePhongDto): import(".prisma/client").Prisma.Prisma__PhongClient<{
        maLoaiPhong: number | null;
        phongId: number;
        tenPhong: string | null;
        trangThai: string | null;
        moTa: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        loaiPhong: {
            dienTich: number | null;
            isMayLanh: boolean | null;
            soNguoiToiDa: number | null;
            giaTien: import("@prisma/client/runtime/library").Decimal | null;
            maLoaiPhong: number;
        };
        hopDong: ({
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
        })[];
        dienNuoc: {
            phongId: number | null;
            thangNam: string | null;
            chiSoDien: number | null;
            chiSoNuoc: number | null;
            idDienNuoc: number;
        }[];
        lapRap: ({
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
        })[];
        nguoiLuuTruTamThoi: {
            phongId: number | null;
            cccd: string | null;
            hoTen: string | null;
            ngaySinh: Date | null;
            sdt: string | null;
            queQuan: string | null;
            idtt: number;
        }[];
    } & {
        maLoaiPhong: number | null;
        phongId: number;
        tenPhong: string | null;
        trangThai: string | null;
        moTa: string | null;
    })[]>;
    findOne(id: number): Promise<{
        loaiPhong: {
            dienTich: number | null;
            isMayLanh: boolean | null;
            soNguoiToiDa: number | null;
            giaTien: import("@prisma/client/runtime/library").Decimal | null;
            maLoaiPhong: number;
        };
        hopDong: ({
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
        })[];
        dienNuoc: {
            phongId: number | null;
            thangNam: string | null;
            chiSoDien: number | null;
            chiSoNuoc: number | null;
            idDienNuoc: number;
        }[];
        lapRap: ({
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
        })[];
        nguoiLuuTruTamThoi: {
            phongId: number | null;
            cccd: string | null;
            hoTen: string | null;
            ngaySinh: Date | null;
            sdt: string | null;
            queQuan: string | null;
            idtt: number;
        }[];
    } & {
        maLoaiPhong: number | null;
        phongId: number;
        tenPhong: string | null;
        trangThai: string | null;
        moTa: string | null;
    }>;
    update(id: number, dto: UpdatePhongDto): Promise<{
        maLoaiPhong: number | null;
        phongId: number;
        tenPhong: string | null;
        trangThai: string | null;
        moTa: string | null;
    }>;
    remove(id: number): Promise<{
        maLoaiPhong: number | null;
        phongId: number;
        tenPhong: string | null;
        trangThai: string | null;
        moTa: string | null;
    }>;
}
