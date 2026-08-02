import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { ChiTietLuanChuyenService } from '../services/chi-tiet-luan-chuyen.service';

const mockThongKeSnapshot = {
    invalidateAll: jest.fn(),
};

const mockPrisma = {
    chiTietLuanChuyen: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

const MOCK_ITEM = {
    chiTietLuanChuyenID: 1,
    suCoId: 10,
    hopDongId: 'HD001',
    phongMoiId: 20,
    ngayLuanChuyen: new Date('2026-01-10'),
    trangThaiLuanChuyen: 0,
    ghiChu: null,
    isDelete: false,
};

describe('ChiTietLuanChuyenService', () => {
    let service: ChiTietLuanChuyenService;

    beforeEach(async () => {
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChiTietLuanChuyenService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
            ],
        }).compile();

        service = module.get(ChiTietLuanChuyenService);
        jest.clearAllMocks();
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
    });

    it('được khởi tạo', () => {
        expect(service).toBeDefined();
    });

    it('lấy danh sách chưa xóa, kèm quan hệ, sắp xếp mới nhất trước', async () => {
        mockPrisma.chiTietLuanChuyen.findMany.mockResolvedValue([MOCK_ITEM]);

        await expect(service.findAll()).resolves.toEqual({
            success: true,
            data: [MOCK_ITEM],
        });
        expect(mockPrisma.chiTietLuanChuyen.findMany).toHaveBeenCalledWith({
            where: { isDelete: false },
            include: { suCo: true, hopDong: true, phongMoi: true },
            orderBy: { chiTietLuanChuyenID: 'desc' },
        });
    });

    it('trả chi tiết luân chuyển và báo lỗi khi không tồn tại', async () => {
        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValueOnce(MOCK_ITEM);
        await expect(service.findOne(1)).resolves.toEqual({
            success: true,
            data: MOCK_ITEM,
        });

        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValueOnce(null);
        await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });

    it('chuyển ngày luân chuyển thành Date khi tạo', async () => {
        mockPrisma.chiTietLuanChuyen.create.mockResolvedValue(MOCK_ITEM);

        await service.create({
            suCoId: 10,
            hopDongId: 'HD001',
            phongMoiId: 20,
            ngayLuanChuyen: '2026-01-10',
        });

        expect(mockPrisma.chiTietLuanChuyen.create).toHaveBeenCalledWith({
            data: {
                suCoId: 10,
                hopDongId: 'HD001',
                phongMoiId: 20,
                ngayLuanChuyen: new Date('2026-01-10'),
            },
        });
        expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('cập nhật sau khi xác nhận chi tiết luân chuyển tồn tại', async () => {
        const updated = { ...MOCK_ITEM, trangThaiLuanChuyen: 2 };
        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.chiTietLuanChuyen.update.mockResolvedValue(updated);

        await expect(
            service.update(1, { trangThaiLuanChuyen: 2 }),
        ).resolves.toEqual({
            success: true,
            message: 'Cập nhật chi tiết luân chuyển thành công!',
            data: updated,
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi cập nhật khi chi tiết luân chuyển không tồn tại', async () => {
        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValue(null);

        await expect(
            service.update(9999, { trangThaiLuanChuyen: 2 }),
        ).rejects.toThrow(NotFoundException);
        expect(mockPrisma.chiTietLuanChuyen.update).not.toHaveBeenCalled();
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('xóa mềm chi tiết luân chuyển', async () => {
        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.chiTietLuanChuyen.update.mockResolvedValue({
            ...MOCK_ITEM,
            isDelete: true,
        });

        await service.remove(1);

        expect(mockPrisma.chiTietLuanChuyen.update).toHaveBeenCalledWith({
            where: { chiTietLuanChuyenID: 1 },
            data: { isDelete: true },
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi xóa khi chi tiết luân chuyển không tồn tại', async () => {
        mockPrisma.chiTietLuanChuyen.findFirst.mockResolvedValue(null);

        await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('không vô hiệu hóa snapshot khi ghi dữ liệu thất bại', async () => {
        mockPrisma.chiTietLuanChuyen.create.mockRejectedValue(new Error('write failed'));

        await expect(
            service.create({ suCoId: 10, hopDongId: 'HD001' }),
        ).rejects.toThrow('write failed');
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });
});