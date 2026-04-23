"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const nguoi_luu_tru_tam_thoi_service_1 = require("../services/nguoi-luu-tru-tam-thoi.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const mockPrisma = {
    nguoiLuuTruTamThoi: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const VALID_ID = 1;
const INVALID_ID = 9999;
const CREATE_DTO = { "hoTen": "Trần Thị B", "cccd": "079987654321", "ngaySinh": "2000-03-20", "sdt": "0912345678", "queQuan": "Bình Dương", "phongId": 1 };
const UPDATE_DTO = { "sdt": "0988888888", "queQuan": "Long An" };
const MOCK_ITEM = { idtt: 1, ...CREATE_DTO };
describe('NguoiLuuTruTamThoiService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                nguoi_luu_tru_tam_thoi_service_1.NguoiLuuTruTamThoiService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(nguoi_luu_tru_tam_thoi_service_1.NguoiLuuTruTamThoiService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll()', () => {
        it('trả về mảng khi có dữ liệu', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findMany.mockResolvedValue([MOCK_ITEM]);
            const result = await service.findAll();
            expect(result).toEqual([MOCK_ITEM]);
            expect(mockPrisma.nguoiLuuTruTamThoi.findMany).toHaveBeenCalledTimes(1);
        });
        it('trả về mảng rỗng khi không có dữ liệu', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findMany.mockResolvedValue([]);
            expect(await service.findAll()).toEqual([]);
        });
    });
    describe('findOne()', () => {
        it('trả về record khi tìm thấy', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(MOCK_ITEM);
            const result = await service.findOne(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.nguoiLuuTruTamThoi.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { idtt: VALID_ID } }));
        });
        it('ném NotFoundException khi không tìm thấy', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('ném NotFoundException với message đúng', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID))
                .rejects.toThrow('không tồn tại');
        });
    });
    describe('create()', () => {
        it('tạo mới và trả về record', async () => {
            mockPrisma.nguoiLuuTruTamThoi.create.mockResolvedValue(MOCK_ITEM);
            const result = await service.create(CREATE_DTO);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.nguoiLuuTruTamThoi.create).toHaveBeenCalledWith(expect.objectContaining({ data: CREATE_DTO }));
        });
        it('gọi prisma.create đúng 1 lần', async () => {
            mockPrisma.nguoiLuuTruTamThoi.create.mockResolvedValue(MOCK_ITEM);
            await service.create(CREATE_DTO);
            expect(mockPrisma.nguoiLuuTruTamThoi.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update()', () => {
        it('cập nhật và trả về record đã sửa', async () => {
            const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.nguoiLuuTruTamThoi.update.mockResolvedValue(updated);
            const result = await service.update(VALID_ID, UPDATE_DTO);
            expect(result).toEqual(updated);
            expect(mockPrisma.nguoiLuuTruTamThoi.update).toHaveBeenCalledWith(expect.objectContaining({ where: { idtt: VALID_ID } }));
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            await expect(service.update(INVALID_ID, UPDATE_DTO))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.update khi record không tồn tại', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            try {
                await service.update(INVALID_ID, UPDATE_DTO);
            }
            catch { }
            expect(mockPrisma.nguoiLuuTruTamThoi.update).not.toHaveBeenCalled();
        });
    });
    describe('remove()', () => {
        it('xóa và trả về record đã xóa', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.nguoiLuuTruTamThoi.delete.mockResolvedValue(MOCK_ITEM);
            const result = await service.remove(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.nguoiLuuTruTamThoi.delete).toHaveBeenCalledWith({ where: { idtt: VALID_ID } });
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            await expect(service.remove(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.delete khi record không tồn tại', async () => {
            mockPrisma.nguoiLuuTruTamThoi.findUnique.mockResolvedValue(null);
            try {
                await service.remove(INVALID_ID);
            }
            catch { }
            expect(mockPrisma.nguoiLuuTruTamThoi.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=nguoi-luu-tru-tam-thoi.service.spec.js.map