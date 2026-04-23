"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chi_tiet_tap_hoa_service_1 = require("../services/chi-tiet-tap-hoa.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const mockPrisma = {
    chiTietTapHoa: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const VALID_ID = 1;
const INVALID_ID = 9999;
const CREATE_DTO = { "maHoaDon": 1, "maHangHoa": 1, "soLuong": 5 };
const UPDATE_DTO = { "soLuong": 10 };
const MOCK_ITEM = { maChiTietHoaDon: 1, ...CREATE_DTO };
describe('ChiTietTapHoaService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chi_tiet_tap_hoa_service_1.ChiTietTapHoaService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
            ],
        }).compile();
        service = module.get(chi_tiet_tap_hoa_service_1.ChiTietTapHoaService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findAll()', () => {
        it('trả về mảng khi có dữ liệu', async () => {
            mockPrisma.chiTietTapHoa.findMany.mockResolvedValue([MOCK_ITEM]);
            const result = await service.findAll();
            expect(result).toEqual([MOCK_ITEM]);
            expect(mockPrisma.chiTietTapHoa.findMany).toHaveBeenCalledTimes(1);
        });
        it('trả về mảng rỗng khi không có dữ liệu', async () => {
            mockPrisma.chiTietTapHoa.findMany.mockResolvedValue([]);
            expect(await service.findAll()).toEqual([]);
        });
    });
    describe('findOne()', () => {
        it('trả về record khi tìm thấy', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(MOCK_ITEM);
            const result = await service.findOne(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.chiTietTapHoa.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { maChiTietHoaDon: VALID_ID } }));
        });
        it('ném NotFoundException khi không tìm thấy', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('ném NotFoundException với message đúng', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            await expect(service.findOne(INVALID_ID))
                .rejects.toThrow('không tồn tại');
        });
    });
    describe('create()', () => {
        it('tạo mới và trả về record', async () => {
            mockPrisma.chiTietTapHoa.create.mockResolvedValue(MOCK_ITEM);
            const result = await service.create(CREATE_DTO);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.chiTietTapHoa.create).toHaveBeenCalledWith(expect.objectContaining({ data: CREATE_DTO }));
        });
        it('gọi prisma.create đúng 1 lần', async () => {
            mockPrisma.chiTietTapHoa.create.mockResolvedValue(MOCK_ITEM);
            await service.create(CREATE_DTO);
            expect(mockPrisma.chiTietTapHoa.create).toHaveBeenCalledTimes(1);
        });
    });
    describe('update()', () => {
        it('cập nhật và trả về record đã sửa', async () => {
            const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.chiTietTapHoa.update.mockResolvedValue(updated);
            const result = await service.update(VALID_ID, UPDATE_DTO);
            expect(result).toEqual(updated);
            expect(mockPrisma.chiTietTapHoa.update).toHaveBeenCalledWith(expect.objectContaining({ where: { maChiTietHoaDon: VALID_ID } }));
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            await expect(service.update(INVALID_ID, UPDATE_DTO))
                .rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.update khi record không tồn tại', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            try {
                await service.update(INVALID_ID, UPDATE_DTO);
            }
            catch { }
            expect(mockPrisma.chiTietTapHoa.update).not.toHaveBeenCalled();
        });
    });
    describe('remove()', () => {
        it('xóa và trả về record đã xóa', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(MOCK_ITEM);
            mockPrisma.chiTietTapHoa.delete.mockResolvedValue(MOCK_ITEM);
            const result = await service.remove(VALID_ID);
            expect(result).toEqual(MOCK_ITEM);
            expect(mockPrisma.chiTietTapHoa.delete).toHaveBeenCalledWith({ where: { maChiTietHoaDon: VALID_ID } });
        });
        it('ném NotFoundException khi record không tồn tại', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            await expect(service.remove(INVALID_ID)).rejects.toThrow(common_1.NotFoundException);
        });
        it('không gọi prisma.delete khi record không tồn tại', async () => {
            mockPrisma.chiTietTapHoa.findUnique.mockResolvedValue(null);
            try {
                await service.remove(INVALID_ID);
            }
            catch { }
            expect(mockPrisma.chiTietTapHoa.delete).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=chi-tiet-tap-hoa.service.spec.js.map