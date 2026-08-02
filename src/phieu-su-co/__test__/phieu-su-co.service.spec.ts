import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { PhieuSuCoService } from '../services/phieu-su-co.service';

const mockThongKeSnapshot = {
    invalidateAll: jest.fn(),
};

const mockPrisma = {
    phieuSuCo: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

const MOCK_ITEM = {
    suCoId: 1,
    phongId: 10,
    tenSuCo: 'Rò rỉ nước',
    ngayBatDau: new Date('2026-01-01'),
    ngayHoanThanh: null,
    trangThaiThongBao: 0,
    chiPhi: 500000,
    isDelete: false,
};

describe('PhieuSuCoService', () => {
    let service: PhieuSuCoService;

    beforeEach(async () => {
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PhieuSuCoService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
            ],
        }).compile();

        service = module.get(PhieuSuCoService);
        jest.clearAllMocks();
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
    });

    it('được khởi tạo', () => {
        expect(service).toBeDefined();
    });

    it('lấy danh sách chưa xóa, kèm phòng, sắp xếp mới nhất trước', async () => {
        mockPrisma.phieuSuCo.findMany.mockResolvedValue([MOCK_ITEM]);

        await expect(service.findAll()).resolves.toEqual({
            success: true,
            data: [MOCK_ITEM],
        });
        expect(mockPrisma.phieuSuCo.findMany).toHaveBeenCalledWith({
            where: { isDelete: false },
            include: { phong: true },
            orderBy: { suCoId: 'desc' },
        });
    });

    it('trả chi tiết phiếu sự cố và báo lỗi khi không tồn tại', async () => {
        mockPrisma.phieuSuCo.findFirst.mockResolvedValueOnce(MOCK_ITEM);
        await expect(service.findOne(1)).resolves.toEqual({
            success: true,
            data: MOCK_ITEM,
        });

        mockPrisma.phieuSuCo.findFirst.mockResolvedValueOnce(null);
        await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });

    it('chuyển ngày bắt đầu/hoàn thành thành Date khi tạo', async () => {
        mockPrisma.phieuSuCo.create.mockResolvedValue(MOCK_ITEM);

        await service.create({
            phongId: 10,
            tenSuCo: 'Rò rỉ nước',
            ngayBatDau: '2026-01-01',
            ngayHoanThanh: '2026-01-05',
        });

        expect(mockPrisma.phieuSuCo.create).toHaveBeenCalledWith({
            data: {
                phongId: 10,
                tenSuCo: 'Rò rỉ nước',
                ngayBatDau: new Date('2026-01-01'),
                ngayHoanThanh: new Date('2026-01-05'),
            },
        });
        expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('cập nhật sau khi xác nhận phiếu sự cố tồn tại', async () => {
        const updated = { ...MOCK_ITEM, chiPhi: 800000 };
        mockPrisma.phieuSuCo.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.phieuSuCo.update.mockResolvedValue(updated);

        await expect(
            service.update(1, { chiPhi: 800000 }),
        ).resolves.toEqual({
            success: true,
            message: 'Cập nhật phiếu sự cố thành công!',
            data: updated,
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi cập nhật khi phiếu sự cố không tồn tại', async () => {
        mockPrisma.phieuSuCo.findFirst.mockResolvedValue(null);

        await expect(
            service.update(9999, { chiPhi: 100000 }),
        ).rejects.toThrow(NotFoundException);
        expect(mockPrisma.phieuSuCo.update).not.toHaveBeenCalled();
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('xóa mềm phiếu sự cố', async () => {
        mockPrisma.phieuSuCo.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.phieuSuCo.update.mockResolvedValue({
            ...MOCK_ITEM,
            isDelete: true,
        });

        await service.remove(1);

        expect(mockPrisma.phieuSuCo.update).toHaveBeenCalledWith({
            where: { suCoId: 1 },
            data: { isDelete: true },
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi xóa khi phiếu sự cố không tồn tại', async () => {
        mockPrisma.phieuSuCo.findFirst.mockResolvedValue(null);

        await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('không vô hiệu hóa snapshot khi ghi dữ liệu thất bại', async () => {
        mockPrisma.phieuSuCo.create.mockRejectedValue(new Error('write failed'));

        await expect(
            service.create({ tenSuCo: 'Rò rỉ nước' }),
        ).rejects.toThrow('write failed');
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });
});