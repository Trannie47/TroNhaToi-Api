import { NguoiLuuTruTamThoiService } from '../services/nguoi-luu-tru-tam-thoi.service';
import { CreateNguoiLuuTruTamThoiDto } from '../dto/create-nguoi-luu-tru-tam-thoi.dto';
import { UpdateNguoiLuuTruTamThoiDto } from '../dto/update-nguoi-luu-tru-tam-thoi.dto';
export declare class NguoiLuuTruTamThoiController {
    private readonly nguoiLuuTruTamThoiService;
    constructor(nguoiLuuTruTamThoiService: NguoiLuuTruTamThoiService);
    create(dto: CreateNguoiLuuTruTamThoiDto): import(".prisma/client").Prisma.Prisma__NguoiLuuTruTamThoiClient<{
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            phongId: number;
            tenPhong: string;
        };
    } & {
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            phongId: number;
            tenPhong: string;
        };
    } & {
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    }>;
    update(id: number, dto: UpdateNguoiLuuTruTamThoiDto): Promise<{
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    }>;
    remove(id: number): Promise<{
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    }>;
}
