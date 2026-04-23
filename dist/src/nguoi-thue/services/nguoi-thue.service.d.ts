import { PrismaService } from '../../prisma/prisma.service';
import { CreateNguoiThueDto } from '../dto/create-nguoi-thue.dto';
import { UpdateNguoiThueDto } from '../dto/update-nguoi-thue.dto';
export declare class NguoiThueService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        hopDong: ({
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
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
        phuongTien: {
            idnt: number | null;
            bienSo: string;
            hangXe: string | null;
            mauSac: string | null;
        }[];
    } & {
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        ghiChu: string | null;
        idnt: number;
    })[]>;
    findOne(id: number): Promise<{
        hopDong: ({
            phong: {
                maLoaiPhong: number | null;
                phongId: number;
                tenPhong: string | null;
                trangThai: string | null;
                moTa: string | null;
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
        phuongTien: {
            idnt: number | null;
            bienSo: string;
            hangXe: string | null;
            mauSac: string | null;
        }[];
    } & {
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        ghiChu: string | null;
        idnt: number;
    }>;
    create(dto: CreateNguoiThueDto): import(".prisma/client").Prisma.Prisma__NguoiThueClient<{
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        ghiChu: string | null;
        idnt: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateNguoiThueDto): Promise<{
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        ghiChu: string | null;
        idnt: number;
    }>;
    remove(id: number): Promise<{
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        ghiChu: string | null;
        idnt: number;
    }>;
}
