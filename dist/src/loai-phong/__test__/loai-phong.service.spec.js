"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const loai_phong_service_1 = require("../services/loai-phong.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const mockPrisma = {
    loaiPhong: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const VALID_ID = 1;
const INVALID_ID = 9999;
const CREATE_DTO = { "dienTich": 25.0, "isMayLanh": true, "soNguoiToiDa": 2, "giaTien": 2000000 };
const UPDATE_DTO = { "giaTien": 2500000, "soNguoiToiDa": 3 };
const MOCK_ITEM = { maLoaiPhong: 1, ...CREATE_DTO };
describe('LoaiPhongService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                loai_phong_service_1.LoaiPhongService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(loai_phong_service_1.LoaiPhongService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll()', () => {
        it('trả về mảng khi có dữ liệu', async () => {
            mockPrisma.loaiPhong.findMany.mockResolvedValue([MOCK_ITEM]);
            const result = await service.findAll();
            expect(result).toEqual([MOCK_ITEM]);
            expect(mockPrisma.loaiPhong.findMany).toHaveBeenCalledTimes(1);
        });
        it('trả về mảng rỗng khi không có dữ liệu', async () => {
            mockPrisma.loaiPhong.findMany.mockResolvedValue([]);
            expect(await service.findAll()).toEqual([]);
        });
    });
    describe('findOne()', () => {
        it('trả về record khi tìm thấy', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
            const result = await service.findOne(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.loaiPhong.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { maLoaiPhong: VALID_ID } }));
        });
        it('ném NotFoundException khi không tìm thấy', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('ném NotFoundException với message đúng', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID))
                .rejects.toThrow('không tồn tại');
        });
    });
    describe('create()', () => {
        it('tạo mới và trả về record', async () => {
            mockPrisma.loaiPhong.create.mockResolvedValue(MOCK_ITEM);
            const result = await service.create(CREATE_DTO);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.loaiPhong.create).toHaveBeenCalledWith(expect.objectContaining({ data: CREATE_DTO }));
        });
        it('gọi prisma.create đúng 1 lần', async () => {
            mockPrisma.loaiPhong.create.mockResolvedValue(MOCK_ITEM);
            await service.create(CREATE_DTO);
            expect(mockPrisma.loaiPhong.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update()', () => {
        it('cập nhật và trả về record đã sửa', async () => {
            const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.loaiPhong.update.mockResolvedValue(updated);
            const result = await service.update(VALID_ID, UPDATE_DTO);
            expect(result).toEqual(updated);
            expect(mockPrisma.loaiPhong.update).toHaveBeenCalledWith(expect.objectContaining({ where: { maLoaiPhong: VALID_ID } }));
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            await expect(service.update(INVALID_ID, UPDATE_DTO))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.update khi record không tồn tại', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            try {
                await service.update(INVALID_ID, UPDATE_DTO);
            }
            catch { }
            expect(mockPrisma.loaiPhong.update).not.toHaveBeenCalled();
        });
    });
    describe('remove()', () => {
        it('xóa và trả về record đã xóa', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.loaiPhong.delete.mockResolvedValue(MOCK_ITEM);
            const result = await service.remove(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.loaiPhong.delete).toHaveBeenCalledWith({ where: { maLoaiPhong: VALID_ID } });
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            await expect(service.remove(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.delete khi record không tồn tại', async () => {
            mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
            try {
                await service.remove(INVALID_ID);
            }
            catch { }
            expect(mockPrisma.loaiPhong.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=loai-phong.service.spec.js.map