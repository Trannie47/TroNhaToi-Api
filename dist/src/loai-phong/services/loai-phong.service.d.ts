import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoaiPhongDto } from '../dto/create-loai-phong.dto';
import { UpdateLoaiPhongDto } from '../dto/update-loai-phong.dto';
export declare class LoaiPhongService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            phongId: number;
            tenPhong: string;
            trangThai: string;
        }[];
    } & {
        dienTich: number | null;
        isMayLanh: boolean | null;
        soNguoiToiDa: number | null;
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        maLoaiPhong: number;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            phongId: number;
            tenPhong: string;
            trangThai: string;
        }[];
    } & {
        dienTich: number | null;
        isMayLanh: boolean | null;
        soNguoiToiDa: number | null;
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        maLoaiPhong: number;
    }>;
    create(dto: CreateLoaiPhongDto): import(".prisma/client").Prisma.Prisma__LoaiPhongClient<{
        dienTich: number | null;
        isMayLanh: boolean | null;
        soNguoiToiDa: number | null;
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        maLoaiPhong: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateLoaiPhongDto): Promise<{
        dienTich: number | null;
        isMayLanh: boolean | null;
        soNguoiToiDa: number | null;
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        maLoaiPhong: number;
    }>;
    remove(id: number): Promise<{
        dienTich: number | null;
        isMayLanh: boolean | null;
        soNguoiToiDa: number | null;
        giaTien: import("@prisma/client/runtime/library").Decimal | null;
        maLoaiPhong: number;
    }>;
}
