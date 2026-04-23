import { PhieuThuHangThangService } from '../services/phieu-thu-hang-thang.service';
import { CreatePhieuThuHangThangDto } from '../dto/create-phieu-thu-hang-thang.dto';
import { UpdatePhieuThuHangThangDto } from '../dto/update-phieu-thu-hang-thang.dto';
export declare class PhieuThuHangThangController {
    private readonly phieuThuHangThangService;
    constructor(phieuThuHangThangService: PhieuThuHangThangService);
    create(dto: CreatePhieuThuHangThangDto): import(".prisma/client").Prisma.Prisma__PhieuThuHangThangClient<{
        ghiChu: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        hoaDonPhong: {
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
        } & {
            hopDongId: number | null;
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
        };
    } & {
        ghiChu: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
    })[]>;
    findOne(id: number): Promise<{
        hoaDonPhong: {
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
        } & {
            hopDongId: number | null;
            thangNam: string | null;
            soTien: import("@prisma/client/runtime/library").Decimal | null;
            maHoaDon: number;
        };
    } & {
        ghiChu: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
    }>;
    update(id: number, dto: UpdatePhieuThuHangThangDto): Promise<{
        ghiChu: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
    }>;
    remove(id: number): Promise<{
        ghiChu: string | null;
        soTien: import("@prisma/client/runtime/library").Decimal | null;
        maHoaDon: number | null;
        ngayThu: Date | null;
        maPhieuThu: number;
    }>;
}
