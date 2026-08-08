import {
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { HopDongService } from '../services/hop-dong.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

const mockThongKeSnapshot = {
    invalidateAll: jest.fn(),
};

const mockPrisma = {
    hopDong: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    phong: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
    nguoiThue: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
    },
    nguoiOGhep: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        updateMany: jest.fn(),
        createMany: jest.fn(),
    },
    hoaDonTapHoa: {
        findMany: jest.fn(),
    },
    hoaDonPhong: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
    },
    dienNuoc: {
        findMany: jest.fn(),
    },
    cauHinhGia: {
        findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
};

// Người đại diện đủ 18 tuổi tại mọi mốc thời gian dùng trong test
const NGUOI_DAI_DIEN = { idnt: 1, ngaySinh: new Date(Date.UTC(1990, 0, 1)) };

const CREATE_DTO = {
    idntDaiDien: 1,
    phongId: 2,
    ngayKy: '2020-01-01',
    ngayHetHan: '2030-01-01',
    tienCoc: 2000000,
    giaPhongThucTe: 2000000,
    trangThai: 1,
} as any;

const MOCK_ITEM = {
    hopDongId: '202001-2-1',
    phongId: 2,
    idntDaiDien: 1,
    ngayKy: new Date(Date.UTC(2020, 0, 1)),
    ngayHetHan: new Date(Date.UTC(2030, 0, 1)),
    tienCoc: 2000000,
    giaPhongThucTe: 2000000,
    trangThai: 1,
    ghiChu: '',
    anhHopDong: 'a.jpg,b.jpg',
    isDelete: false,
};

describe('HopDongService', () => {
    let service: HopDongService;

    beforeEach(async () => {
        jest.clearAllMocks();
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
        // Mặc định: không ai đứng ở ghép / không có hợp đồng nào khác cản trở
        mockPrisma.nguoiOGhep.findMany.mockResolvedValue([]);
        mockPrisma.nguoiThue.findFirst.mockResolvedValue(NGUOI_DAI_DIEN);
        mockPrisma.nguoiThue.findMany.mockResolvedValue([]);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HopDongService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
            ],
        }).compile();

        service = module.get(HopDongService);
    });

    it('được khởi tạo', () => {
        expect(service).toBeDefined();
    });

    it('lấy danh sách và chuyển chuỗi ảnh thành mảng', async () => {
        mockPrisma.hopDong.findMany.mockResolvedValue([MOCK_ITEM]);

        const result = await service.findAll();

        expect(result[0].anhHopDong).toEqual(['a.jpg', 'b.jpg']);
        expect(mockPrisma.hopDong.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { isDelete: false },
                orderBy: { ngayKy: 'desc' },
            }),
        );
    });

    it('lọc phòng còn sức chứa để tạo hợp đồng (đếm theo 1 đại diện + số người ở ghép)', async () => {
        (mockPrisma as any).phong.findMany = jest.fn().mockResolvedValue([
            {
                phongId: 1,
                tenPhong: 'P101',
                loaiPhong: { soNguoiToiDa: 2, giaTien: 2000000 },
                HopDong: [{ hopDongId: 'HD1', nguoiOGhep: [{ cccd: 'x' }] }], // 1 đại diện + 1 ở ghép = 2 (đầy)
            },
            {
                phongId: 2,
                tenPhong: 'P102',
                loaiPhong: { soNguoiToiDa: 3, giaTien: 2000000 },
                HopDong: [{ hopDongId: 'HD2', nguoiOGhep: [] }], // 1 đại diện = 1 (còn 2 chỗ)
            },
        ]);

        const result = await service.getRoomsAvailableForContract();

        expect(result).toEqual([
            expect.objectContaining({ id: 2, tenPhong: 'P102', soNguoiHienTai: 1, soChoConLai: 2 }),
        ]);
    });

    describe('create', () => {
        it('tạo hợp đồng trong transaction và cập nhật trạng thái liên quan', async () => {
            mockPrisma.phong.findUnique.mockResolvedValue({
                phongId: 2,
                isDelete: false,
                loaiPhong: { soNguoiToiDa: 2, giaTien: 2000000 },
            });
            mockPrisma.hopDong.findMany.mockResolvedValue([]); // không có hợp đồng nào khác đang hoạt động trong phòng
            mockPrisma.hopDong.count.mockResolvedValue(0);
            mockPrisma.hopDong.create.mockResolvedValue(MOCK_ITEM);
            mockPrisma.hopDong.findUnique.mockResolvedValue(MOCK_ITEM);

            const result = await service.create(CREATE_DTO, ['a.jpg', 'b.jpg']);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(MOCK_ITEM);
            expect(mockPrisma.hopDong.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    hopDongId: '202001-2-1',
                    idntDaiDien: 1,
                    anhHopDong: 'a.jpg,b.jpg',
                    trangThai: 1,
                }),
            });
            expect(mockPrisma.phong.update).toHaveBeenCalledWith({
                where: { phongId: 2 },
                data: { trangThai: 1 },
            });
            expect(mockPrisma.nguoiThue.update).toHaveBeenCalledWith({
                where: { idnt: 1 },
                data: { trangThai: 1 },
            });
            expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
            expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
            expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
        });

        it('không tạo khi phòng không tồn tại', async () => {
            mockPrisma.phong.findUnique.mockResolvedValue(null);

            await expect(service.create(CREATE_DTO, [])).rejects.toThrow(
                BadRequestException,
            );
            expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
        });

        it('không tạo khi vượt sức chứa phòng', async () => {
            mockPrisma.phong.findUnique.mockResolvedValue({
                phongId: 2,
                isDelete: false,
                loaiPhong: { soNguoiToiDa: 1, giaTien: 2000000 },
            });
            // Phòng đã có 1 hợp đồng khác đang hoạt động (1 đại diện) -> đã đầy trước khi tạo thêm
            mockPrisma.hopDong.findMany.mockResolvedValue([
                { hopDongId: 'HD-KHAC', nguoiOGhep: [] },
            ]);

            await expect(service.create(CREATE_DTO, [])).rejects.toThrow(
                BadRequestException,
            );
            expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
        });

        it('không tạo khi người đại diện chưa đủ 18 tuổi', async () => {
            mockPrisma.phong.findUnique.mockResolvedValue({
                phongId: 2,
                isDelete: false,
                loaiPhong: { soNguoiToiDa: 2, giaTien: 2000000 },
            });
            mockPrisma.nguoiThue.findFirst.mockResolvedValue({
                idnt: 1,
                ngaySinh: new Date(Date.UTC(2015, 0, 1)), // 5 tuổi tại thời điểm ngayKy 2020-01-01
            });

            await expect(service.create(CREATE_DTO, [])).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('update', () => {
        it('cập nhật trực tiếp hợp đồng đang chờ hiệu lực (LUỒNG 1, không tách phiên bản dù đổi giá)', async () => {
            const existing = {
                ...MOCK_ITEM,
                trangThai: 0,
                ngayKy: new Date(Date.UTC(2099, 0, 1)), // chưa tới hiệu lực
                ngayHetHan: new Date(Date.UTC(2100, 0, 1)),
            };
            mockPrisma.hopDong.findFirst.mockResolvedValueOnce(existing); // existingHopDong
            mockPrisma.phong.findUnique.mockResolvedValue({
                loaiPhong: { soNguoiToiDa: 2 },
            });
            mockPrisma.hopDong.findMany.mockResolvedValue([]); // không có hợp đồng khác trong phòng
            mockPrisma.hopDong.update.mockResolvedValue({
                ...existing,
                giaPhongThucTe: 2500000,
            });
            mockPrisma.hopDong.findUnique.mockResolvedValue({
                ...existing,
                giaPhongThucTe: 2500000,
            });

            const result = await service.update(
                MOCK_ITEM.hopDongId,
                { phongId: 2, giaPhongThucTe: 2500000 } as any,
                [],
            );

            expect(mockPrisma.hopDong.update).toHaveBeenCalledWith(
                expect.objectContaining({ where: { hopDongId: MOCK_ITEM.hopDongId } }),
            );
            expect(mockPrisma.hopDong.create).not.toHaveBeenCalled();
            expect(result.success).toBe(true);
            expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
            expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
        });

        it('tách phiên bản mới khi đổi giá hợp đồng đang hiệu lực (LUỒNG 2)', async () => {
            const existing = {
                ...MOCK_ITEM,
                trangThai: 1,
                ngayKy: new Date(Date.UTC(2020, 0, 1)), // đã hiệu lực từ trước
            };
            const replacement = { ...MOCK_ITEM, hopDongId: '202001-2-2', trangThai: 1 };

            mockPrisma.hopDong.findFirst.mockResolvedValueOnce(existing);
            mockPrisma.phong.findUnique.mockResolvedValue({
                loaiPhong: { soNguoiToiDa: 2 },
            });
            mockPrisma.hopDong.findMany.mockResolvedValue([]);
            mockPrisma.hopDong.update.mockResolvedValue({ ...existing, trangThai: 2 });
            mockPrisma.hopDong.count.mockResolvedValue(1);
            mockPrisma.hopDong.create.mockResolvedValue(replacement);
            mockPrisma.hopDong.findUnique.mockResolvedValue(replacement);

            const result = await service.update(
                existing.hopDongId,
                { phongId: 2, giaPhongThucTe: 2500000 } as any,
                [],
            );

            expect(mockPrisma.hopDong.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { hopDongId: existing.hopDongId },
                    data: expect.objectContaining({ trangThai: 2 }),
                }),
            );
            expect(mockPrisma.hopDong.create).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({ data: replacement }));
            expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
            expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        });

        it('LUỒNG 2: người ở ghép tiếp tục ở được tạo dòng RIÊNG cho hợp đồng mới, không đụng dòng của họ ở hợp đồng cũ (giữ lịch sử)', async () => {
            const existing = {
                ...MOCK_ITEM,
                trangThai: 1,
                ngayKy: new Date(Date.UTC(2020, 0, 1)),
            };
            const replacement = { ...MOCK_ITEM, hopDongId: '202001-2-2', trangThai: 1 };

            mockPrisma.hopDong.findFirst.mockResolvedValueOnce(existing);
            mockPrisma.phong.findUnique.mockResolvedValue({
                loaiPhong: { soNguoiToiDa: 5 },
            });
            mockPrisma.hopDong.findMany.mockResolvedValue([]);
            mockPrisma.hopDong.update.mockResolvedValue({ ...existing, trangThai: 2 });
            mockPrisma.hopDong.count.mockResolvedValue(1);
            mockPrisma.hopDong.create.mockResolvedValue(replacement);
            mockPrisma.hopDong.findUnique.mockResolvedValue(replacement);

            const danhSachNguoiOGhep = [
                { cccd: '079201001234', hoTen: 'Nguyễn Thị B' },
                { cccd: '079201005678', hoTen: 'Trần Văn C' },
            ];

            await service.update(
                existing.hopDongId,
                { phongId: 2, giaPhongThucTe: 2500000, danhSachNguoiOGhep } as any,
                [],
            );

            // Không được "chuyển" (upsert) dòng người ở ghép cũ sang hợp đồng mới - việc đó sẽ
            // xóa mất liên kết của họ với hợp đồng cũ (đây chính là bug đã xảy ra thực tế).
            expect(mockPrisma.nguoiOGhep.upsert).not.toHaveBeenCalled();
            // Phải tạo DÒNG MỚI RIÊNG gắn với hopDongId mới (khác hẳn hợp đồng cũ), hợp đồng cũ
            // không hề bị nhắc tới trong lời gọi createMany này -> vẫn giữ nguyên lịch sử.
            const hopDongIdMoiThucTe = mockPrisma.hopDong.create.mock.calls[0][0].data.hopDongId;
            expect(hopDongIdMoiThucTe).not.toEqual(existing.hopDongId);
            expect(mockPrisma.nguoiOGhep.createMany).toHaveBeenCalledWith({
                data: [
                    expect.objectContaining({ cccd: '079201001234', hopDongId: hopDongIdMoiThucTe }),
                    expect.objectContaining({ cccd: '079201005678', hopDongId: hopDongIdMoiThucTe }),
                ],
            });
        });

        it('không cho chuyển hợp đồng sang phòng khác', async () => {
            mockPrisma.hopDong.findFirst.mockResolvedValueOnce(MOCK_ITEM);

            await expect(
                service.update(MOCK_ITEM.hopDongId, { phongId: 99 } as any, []),
            ).rejects.toThrow(BadRequestException);
            expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
        });
    });

    it('gia hạn hợp đồng và vô hiệu hóa snapshot đúng một lần', async () => {
        const ngayHetHanCu = new Date();
        ngayHetHanCu.setHours(0, 0, 0, 0); // trong hạn 30 ngày để được phép gia hạn
        const ngayHetHanMoiISO = new Date(
            ngayHetHanCu.getFullYear(),
            ngayHetHanCu.getMonth(),
            ngayHetHanCu.getDate() + 30,
        ).toISOString();

        mockPrisma.hopDong.findFirst.mockResolvedValue({
            ...MOCK_ITEM,
            trangThai: 1,
            ngayHetHan: ngayHetHanCu,
        });
        mockPrisma.hopDong.update.mockResolvedValue({
            ...MOCK_ITEM,
            trangThai: 1,
            ngayHetHan: new Date(ngayHetHanMoiISO),
        });

        const result = await service.giaHan(
            MOCK_ITEM.hopDongId,
            { ngayHetHanMoi: ngayHetHanMoiISO },
            [],
        );

        expect(result.success).toBe(true);
        expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('trả chi tiết, xóa mềm và báo lỗi khi không tồn tại', async () => {
        mockPrisma.hopDong.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.hopDong.update.mockResolvedValue({
            ...MOCK_ITEM,
            isDelete: true,
        });

        await expect(service.findOne(MOCK_ITEM.hopDongId)).resolves.toEqual(
            MOCK_ITEM,
        );
        await service.remove(MOCK_ITEM.hopDongId);
        expect(mockPrisma.hopDong.update).toHaveBeenCalledWith({
            where: { hopDongId: MOCK_ITEM.hopDongId },
            data: { isDelete: true },
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);

        mockPrisma.hopDong.findFirst.mockResolvedValue(null);
        await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });

    describe('cancelContract (hủy hợp đồng chờ hiệu lực)', () => {
        it('chặn hủy khi người đại diện còn nợ hóa đơn tạp hóa', async () => {
            mockPrisma.hopDong.findFirst.mockResolvedValueOnce({ ...MOCK_ITEM, trangThai: 0 });
            mockPrisma.hoaDonTapHoa.findMany.mockResolvedValue([
                { tongTien: 100000, phieuThuHdTh: [] },
            ]);

            await expect(service.cancelContract(MOCK_ITEM.hopDongId)).rejects.toThrow(
                BadRequestException,
            );
            expect(mockPrisma.$transaction).not.toHaveBeenCalled();
        });

        it('hủy thành công khi hết nợ tạp hóa và giải phóng phòng/đại diện', async () => {
            mockPrisma.hopDong.findFirst
                .mockResolvedValueOnce({ ...MOCK_ITEM, trangThai: 0 }) // findOne
                .mockResolvedValueOnce(null) // conHopDongKhacCuaPhong
                .mockResolvedValueOnce(null); // conHopDongKhacCuaDaiDien
            mockPrisma.hoaDonTapHoa.findMany.mockResolvedValue([]);
            mockPrisma.hopDong.update.mockResolvedValue({ ...MOCK_ITEM, isDelete: true });

            const result = await service.cancelContract(MOCK_ITEM.hopDongId);

            expect(result.success).toBe(true);
            expect(mockPrisma.phong.update).toHaveBeenCalledWith({
                where: { phongId: MOCK_ITEM.phongId },
                data: { trangThai: 0 },
            });
            expect(mockPrisma.nguoiThue.update).toHaveBeenCalledWith({
                where: { idnt: MOCK_ITEM.idntDaiDien },
                data: { trangThai: 0 },
            });
        });
    });

    describe('terminateContract (kết thúc hợp đồng đang hiệu lực)', () => {
        it('chặn kết thúc khi còn hóa đơn phòng chưa thanh toán', async () => {
            mockPrisma.hopDong.findFirst.mockResolvedValueOnce({ ...MOCK_ITEM, trangThai: 1 });
            mockPrisma.hoaDonPhong.findFirst.mockResolvedValue({ trangThai: 0 });

            await expect(service.terminateContract(MOCK_ITEM.hopDongId)).rejects.toThrow(
                BadRequestException,
            );
            expect(mockPrisma.$transaction).not.toHaveBeenCalled();
        });

        it('chặn kết thúc khi còn nợ tạp hóa của đại diện', async () => {
            mockPrisma.hopDong.findFirst.mockResolvedValueOnce({ ...MOCK_ITEM, trangThai: 1 });
            mockPrisma.hoaDonPhong.findFirst.mockResolvedValue(null);
            mockPrisma.hoaDonTapHoa.findMany.mockResolvedValue([
                { tongTien: 50000, phieuThuHdTh: [] },
            ]);

            await expect(service.terminateContract(MOCK_ITEM.hopDongId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('kết thúc thành công khi phòng vẫn còn hợp đồng khác (bỏ qua check điện nước)', async () => {
            mockPrisma.hopDong.findFirst
                .mockResolvedValueOnce({ ...MOCK_ITEM, trangThai: 1 }) // findOne
                .mockResolvedValueOnce({ hopDongId: 'HD-KHAC' }) // conHopDongKhacCuaPhongTruocKhiKetThuc -> có -> bỏ qua check điện nước
                .mockResolvedValueOnce(null) // conHopDongKhacCuaPhong (trong transaction)
                .mockResolvedValueOnce(null); // conHopDongKhacCuaDaiDien (trong transaction)
            mockPrisma.hoaDonPhong.findFirst.mockResolvedValue(null);
            mockPrisma.hoaDonTapHoa.findMany.mockResolvedValue([]);
            mockPrisma.hopDong.update.mockResolvedValue({ ...MOCK_ITEM, trangThai: 2 });

            const result = await service.terminateContract(MOCK_ITEM.hopDongId);

            expect(result.success).toBe(true);
            expect(mockPrisma.dienNuoc.findMany).not.toHaveBeenCalled();
            expect(mockPrisma.nguoiThue.update).toHaveBeenCalledWith({
                where: { idnt: MOCK_ITEM.idntDaiDien },
                data: { trangThai: 0 },
            });
        });
    });

    it('tìm kiếm và phân trang hợp đồng', async () => {
        mockPrisma.hopDong.findMany.mockResolvedValue([MOCK_ITEM]);
        mockPrisma.hopDong.count.mockResolvedValue(1);

        await expect(
            service.search({ ma: '202001', limit: 5, offset: 0 } as any),
        ).resolves.toEqual({ total: 1, data: [MOCK_ITEM] });

        expect(mockPrisma.hopDong.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {
                    isDelete: false,
                    hopDongId: { contains: '202001' },
                },
                take: 5,
            }),
        );
    });
});
