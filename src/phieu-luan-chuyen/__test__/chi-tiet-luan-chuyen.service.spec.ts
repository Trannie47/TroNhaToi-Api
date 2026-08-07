import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { PhieuLuanChuyenService } from '../services/phieu-luan-chuyen.service';

const mockThongKeSnapshot = {
    invalidateAll: jest.fn(),
};

const mockPrisma = {
    phieuLuanChuyen: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
    $transaction: jest.fn(),
};

const MOCK_ITEM = {
    chiTietLuanChuyenID: 1,
    hopDongId: 'HD001',
    phongMoiId: 20,
    tuNgay: new Date('2026-01-10'),
    denNgay: null,
    lyDoLuanChuyen: 'Chuyển phòng theo yêu cầu',
    chiPhi: 0,
    ghiChu: null,
    isDelete: false,
};

describe('PhieuLuanChuyenService', () => {
    let service: PhieuLuanChuyenService;

    beforeEach(async () => {
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PhieuLuanChuyenService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
            ],
        }).compile();

        service = module.get(PhieuLuanChuyenService);
        jest.clearAllMocks();
        mockPrisma.$transaction.mockImplementation((callback: any) =>
            callback(mockPrisma),
        );
    });

    it('được khởi tạo', () => {
        expect(service).toBeDefined();
    });

    it('lấy danh sách chưa xóa, kèm quan hệ, sắp xếp mới nhất trước', async () => {
        mockPrisma.phieuLuanChuyen.findMany.mockResolvedValue([MOCK_ITEM]);

        await expect(service.findAll()).resolves.toEqual({
            success: true,
            data: [MOCK_ITEM],
        });
        expect(mockPrisma.phieuLuanChuyen.findMany).toHaveBeenCalledWith({
            where: { isDelete: false },
            include: { hopDong: true, phongMoi: true },
            orderBy: { chiTietLuanChuyenID: 'desc' },
        });
    });

    it('trả chi tiết phiếu luân chuyển và báo lỗi khi không tồn tại', async () => {
        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValueOnce(MOCK_ITEM);
        await expect(service.findOne(1)).resolves.toEqual({
            success: true,
            data: MOCK_ITEM,
        });

        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValueOnce(null);
        await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });

    it('chuyển tuNgay/denNgay thành Date khi tạo', async () => {
        mockPrisma.phieuLuanChuyen.create.mockResolvedValue(MOCK_ITEM);

        await service.create({
            hopDongId: 'HD001',
            phongMoiId: 20,
            tuNgay: '2026-01-10',
            denNgay: '2026-02-10',
            lyDoLuanChuyen: 'Chuyển phòng theo yêu cầu',
            chiPhi: 0,
            ghiChu: undefined,
        });

        expect(mockPrisma.phieuLuanChuyen.create).toHaveBeenCalledWith({
            data: {
                hopDongId: 'HD001',
                phongMoiId: 20,
                tuNgay: new Date('2026-01-10'),
                denNgay: new Date('2026-02-10'),
                lyDoLuanChuyen: 'Chuyển phòng theo yêu cầu',
                chiPhi: 0,
                ghiChu: undefined,
            },
        });
        expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('cập nhật sau khi xác nhận phiếu luân chuyển tồn tại', async () => {
        const updated = { ...MOCK_ITEM, lyDoLuanChuyen: 'Lý do mới' };
        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.phieuLuanChuyen.update.mockResolvedValue(updated);

        await expect(
            service.update(1, { lyDoLuanChuyen: 'Lý do mới' }),
        ).resolves.toEqual({
            success: true,
            message: 'Cập nhật phiếu luân chuyển thành công!',
            data: updated,
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi cập nhật khi phiếu luân chuyển không tồn tại', async () => {
        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValue(null);

        await expect(
            service.update(9999, { lyDoLuanChuyen: 'Lý do mới' }),
        ).rejects.toThrow(NotFoundException);
        expect(mockPrisma.phieuLuanChuyen.update).not.toHaveBeenCalled();
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('xóa mềm phiếu luân chuyển', async () => {
        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValue(MOCK_ITEM);
        mockPrisma.phieuLuanChuyen.update.mockResolvedValue({
            ...MOCK_ITEM,
            isDelete: true,
        });

        await service.remove(1);

        expect(mockPrisma.phieuLuanChuyen.update).toHaveBeenCalledWith({
            where: { chiTietLuanChuyenID: 1 },
            data: { isDelete: true },
        });
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledTimes(1);
        expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('báo lỗi xóa khi phiếu luân chuyển không tồn tại', async () => {
        mockPrisma.phieuLuanChuyen.findFirst.mockResolvedValue(null);

        await expect(service.remove(9999)).rejects.toThrow(NotFoundException);
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });

    it('không vô hiệu hóa snapshot khi ghi dữ liệu thất bại', async () => {
        mockPrisma.phieuLuanChuyen.create.mockRejectedValue(new Error('write failed'));

        await expect(
            service.create({ hopDongId: 'HD001', phongMoiId: 20 }),
        ).rejects.toThrow('write failed');
        expect(mockThongKeSnapshot.invalidateAll).not.toHaveBeenCalled();
    });
});