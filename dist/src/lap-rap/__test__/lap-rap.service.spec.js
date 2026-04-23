"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const lap_rap_service_1 = require("../services/lap-rap.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const mockPrisma = {
    lapRap: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const VALID_ID = 1;
const INVALID_ID = 9999;
const CREATE_DTO = { "phongId": 1, "thietBiId": 1, "ngayLap": "2023-06-15", "soLuong": 1 };
const UPDATE_DTO = { "soLuong": 2 };
const MOCK_ITEM = { id: 1, ...CREATE_DTO };
describe('LapRapService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                lap_rap_service_1.LapRapService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(lap_rap_service_1.LapRapService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll()', () => {
        it('trả về mảng khi có dữ liệu', async () => {
            mockPrisma.lapRap.findMany.mockResolvedValue([MOCK_ITEM]);
            const result = await service.findAll();
            expect(result).toEqual([MOCK_ITEM]);
            expect(mockPrisma.lapRap.findMany).toHaveBeenCalledTimes(1);
        });
        it('trả về mảng rỗng khi không có dữ liệu', async () => {
            mockPrisma.lapRap.findMany.mockResolvedValue([]);
            expect(await service.findAll()).toEqual([]);
        });
    });
    describe('findOne()', () => {
        it('trả về record khi tìm thấy', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(MOCK_ITEM);
            const result = await service.findOne(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.lapRap.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: VALID_ID } }));
        });
        it('ném NotFoundException khi không tìm thấy', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('ném NotFoundException với message đúng', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID))
                .rejects.toThrow('không tồn tại');
        });
    });
    describe('create()', () => {
        it('tạo mới và trả về record', async () => {
            mockPrisma.lapRap.create.mockResolvedValue(MOCK_ITEM);
            const result = await service.create(CREATE_DTO);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.lapRap.create).toHaveBeenCalledWith(expect.objectContaining({ data: CREATE_DTO }));
        });
        it('gọi prisma.create đúng 1 lần', async () => {
            mockPrisma.lapRap.create.mockResolvedValue(MOCK_ITEM);
            await service.create(CREATE_DTO);
            expect(mockPrisma.lapRap.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update()', () => {
        it('cập nhật và trả về record đã sửa', async () => {
            const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
            mockPrisma.lapRap.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.lapRap.update.mockResolvedValue(updated);
            const result = await service.update(VALID_ID, UPDATE_DTO);
            expect(result).toEqual(updated);
            expect(mockPrisma.lapRap.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: VALID_ID } }));
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            await expect(service.update(INVALID_ID, UPDATE_DTO))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.update khi record không tồn tại', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            try {
                await service.update(INVALID_ID, UPDATE_DTO);
            }
            catch { }
            expect(mockPrisma.lapRap.update).not.toHaveBeenCalled();
        });
    });
    describe('remove()', () => {
        it('xóa và trả về record đã xóa', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.lapRap.delete.mockResolvedValue(MOCK_ITEM);
            const result = await service.remove(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.lapRap.delete).toHaveBeenCalledWith({ where: { id: VALID_ID } });
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            await expect(service.remove(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.delete khi record không tồn tại', async () => {
            mockPrisma.lapRap.findUnique.mockResolvedValue(null);
            try {
                await service.remove(INVALID_ID);
            }
            catch { }
            expect(mockPrisma.lapRap.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=lap-rap.service.spec.js.map