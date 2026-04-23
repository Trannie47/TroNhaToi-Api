import { PrismaService } from '../../prisma/prisma.service';
import { CreateHangHoaDto } from '../dto/create-hang-hoa.dto';
import { UpdateHangHoaDto } from '../dto/update-hang-hoa.dto';
export declare class HangHoaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({} & {
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    })[]>;
    findOne(id: number): Promise<{} & {
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    }>;
    create(dto: CreateHangHoaDto): import(".prisma/client").Prisma.Prisma__HangHoaClient<{
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: number, dto: UpdateHangHoaDto): Promise<{
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    }>;
    remove(id: number): Promise<{
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    }>;
}
