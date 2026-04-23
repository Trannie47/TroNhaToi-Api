import { DienNuocService } from '../services/dien-nuoc.service';
import { CreateDienNuocDto } from '../dto/create-dien-nuoc.dto';
import { UpdateDienNuocDto } from '../dto/update-dien-nuoc.dto';
export declare class DienNuocController {
    private readonly dienNuocService;
    constructor(dienNuocService: DienNuocService);
    create(dto: CreateDienNuocDto): import(".prisma/client").Prisma.Prisma__DienNuocClient<{
        phongId: number | null;
        thangNam: string | null;
        chiSoDien: number | null;
        chiSoNuoc: number | null;
        idDienNuoc: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        phong: {
            phongId: number;
            tenPhong: string;
        };
    } & {
        phongId: number | null;
        thangNam: string | null;
        chiSoDien: number | null;
        chiSoNuoc: number | null;
        idDienNuoc: number;
    })[]>;
    findOne(id: number): Promise<{
        phong: {
            phongId: number;
            tenPhong: string;
        };
    } & {
        phongId: number | null;
        thangNam: string | null;
        chiSoDien: number | null;
        chiSoNuoc: number | null;
        idDienNuoc: number;
    }>;
    update(id: number, dto: UpdateDienNuocDto): Promise<{
        phongId: number | null;
        thangNam: string | null;
        chiSoDien: number | null;
        chiSoNuoc: number | null;
        idDienNuoc: number;
    }>;
    remove(id: number): Promise<{
        phongId: number | null;
        thangNam: string | null;
        chiSoDien: number | null;
        chiSoNuoc: number | null;
        idDienNuoc: number;
    }>;
}
