"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const hop_dong_service_1 = require("../services/hop-dong.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const mockPrisma = {
    hopDong: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const VALID_ID = 1;
const INVALID_ID = 9999;
const CREATE_DTO = { "idnt": 1, "phongId": 1, "ngayKy": "2024-01-01", "ngayHetHan": "2025-01-01", "tienCoc": 2000000, "giaPhongThucTe": 2000000, "trangThai": "dangThue" };
const UPDATE_DTO = { "trangThai": "hetHan", "giaPhongThucTe": 2500000 };
const MOCK_ITEM = { hopDongId: 1, ...CREATE_DTO };
describe('HopDongService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                hop_dong_service_1.HopDongService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(hop_dong_service_1.HopDongService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll()', () => {
        it('trả về mảng khi có dữ liệu', async () => {
            mockPrisma.hopDong.findMany.mockResolvedValue([MOCK_ITEM]);
            const result = await service.findAll();
            expect(result).toEqual([MOCK_ITEM]);
            expect(mockPrisma.hopDong.findMany).toHaveBeenCalledTimes(1);
        });
        it('trả về mảng rỗng khi không có dữ liệu', async () => {
            mockPrisma.hopDong.findMany.mockResolvedValue([]);
            expect(await service.findAll()).toEqual([]);
        });
    });
    describe('findOne()', () => {
        it('trả về record khi tìm thấy', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(MOCK_ITEM);
            const result = await service.findOne(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.hopDong.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { hopDongId: VALID_ID } }));
        });
        it('ném NotFoundException khi không tìm thấy', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('ném NotFoundException với message đúng', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID))
                .rejects.toThrow('không tồn tại');
        });
    });
    describe('create()', () => {
        it('tạo mới và trả về record', async () => {
            mockPrisma.hopDong.create.mockResolvedValue(MOCK_ITEM);
            const result = await service.create(CREATE_DTO);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.hopDong.create).toHaveBeenCalledWith(expect.objectContaining({ data: CREATE_DTO }));
        });
        it('gọi prisma.create đúng 1 lần', async () => {
            mockPrisma.hopDong.create.mockResolvedValue(MOCK_ITEM);
            await service.create(CREATE_DTO);
            expect(mockPrisma.hopDong.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update()', () => {
        it('cập nhật và trả về record đã sửa', async () => {
            const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
            mockPrisma.hopDong.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.hopDong.update.mockResolvedValue(updated);
            const result = await service.update(VALID_ID, UPDATE_DTO);
            expect(result).toEqual(updated);
            expect(mockPrisma.hopDong.update).toHaveBeenCalledWith(expect.objectContaining({ where: { hopDongId: VALID_ID } }));
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            await expect(service.update(INVALID_ID, UPDATE_DTO))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.update khi record không tồn tại', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            try {
                await service.update(INVALID_ID, UPDATE_DTO);
            }
            catch { }
            expect(mockPrisma.hopDong.update).not.toHaveBeenCalled();
        });
    });
    describe('remove()', () => {
        it('xóa và trả về record đã xóa', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.hopDong.delete.mockResolvedValue(MOCK_ITEM);
            const result = await service.remove(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.hopDong.delete).toHaveBeenCalledWith({ where: { hopDongId: VALID_ID } });
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            await expect(service.remove(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.delete khi record không tồn tại', async () => {
            mockPrisma.hopDong.findUnique.mockResolvedValue(null);
            try {
                await service.remove(INVALID_ID);
            }
            catch { }
            expect(mockPrisma.hopDong.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=hop-dong.service.spec.js.map