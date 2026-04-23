import { HangHoaService } from '../services/hang-hoa.service';
import { CreateHangHoaDto } from '../dto/create-hang-hoa.dto';
import { UpdateHangHoaDto } from '../dto/update-hang-hoa.dto';
export declare class HangHoaController {
    private readonly hangHoaService;
    constructor(hangHoaService: HangHoaService);
    create(dto: CreateHangHoaDto): import(".prisma/client").Prisma.Prisma__HangHoaClient<{
        tenHangHoa: string | null;
        giaNhap: import("@prisma/client/runtime/library").Decimal | null;
        giaBan: import("@prisma/client/runtime/library").Decimal | null;
        maHangHoa: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
