import { PrismaService } from '../../prisma/prisma.service';
import { CreateNguoiLuuTruTamThoiDto } from '../dto/create-nguoi-luu-tru-tam-thoi.dto';
import { UpdateNguoiLuuTruTamThoiDto } from '../dto/update-nguoi-luu-tru-tam-thoi.dto';
export declare class NguoiLuuTruTamThoiService {
    private prisma;
    constructor(prisma: PrismaService);
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
    create(dto: CreateNguoiLuuTruTamThoiDto): import(".prisma/client").Prisma.Prisma__NguoiLuuTruTamThoiClient<{
        phongId: number | null;
        cccd: string | null;
        hoTen: string | null;
        ngaySinh: Date | null;
        sdt: string | null;
        queQuan: string | null;
        idtt: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
