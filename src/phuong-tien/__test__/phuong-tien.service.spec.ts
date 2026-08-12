import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PhuongTienService } from '../services/phuong-tien.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  phuongTien: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

// ─── Fixtures ────────────────────────────────────────────────────────
const VALID_ID = 1;
const INVALID_ID = 9999;
const IDNT = 1;

const CREATE_DTO = {
  bienSo: '51A-00001',
  SoTien: 5000000,
  hangXe: 'Honda Wave',
  mauSac: 'Đen',
  idnt: IDNT,
};
const UPDATE_DTO = { hangXe: 'Yamaha Sirius', mauSac: 'Trắng' };
const MOCK_ITEM = { ID: VALID_ID, ...CREATE_DTO, phongId: null, loaixe: 0, isDelete: false };

describe('PhuongTienService', () => {
  let service: PhuongTienService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhuongTienService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<PhuongTienService>(PhuongTienService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── findByNguoiThue ────────────────────────────────────────────────
  describe('findByNguoiThue()', () => {
    it('trả về danh sách xe còn hoạt động của người thuê', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([MOCK_ITEM]);

      const result = await service.findByNguoiThue(IDNT);

      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { idnt: IDNT, isDelete: false },
          orderBy: { ID: 'desc' },
        }),
      );
    });

    it('trả về mảng rỗng khi người thuê không có xe nào', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([]);
      expect(await service.findByNguoiThue(IDNT)).toEqual([]);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────
  describe('findOne()', () => {
    it('trả về record khi tìm thấy', async () => {
      mockPrisma.phuongTien.findFirst.mockResolvedValue(MOCK_ITEM);

      const result = await service.findOne(VALID_ID);

      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.phuongTien.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ID: VALID_ID, isDelete: false } }),
      );
    });

    it('ném NotFoundException khi không tìm thấy', async () => {
      mockPrisma.phuongTien.findFirst.mockResolvedValue(null);
      await expect(service.findOne(INVALID_ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────
  describe('create()', () => {
    it('tạo mới và trả về record', async () => {
      mockPrisma.phuongTien.create.mockResolvedValue(MOCK_ITEM);

      const result = await service.create(CREATE_DTO as any);

      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.phuongTien.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bienSo: '51A-00001',
            hangXe: 'Honda Wave',
            idnt: IDNT,
          }),
        }),
      );
    });

    it('dùng "Không BKS" làm mặc định khi không truyền biển số', async () => {
      mockPrisma.phuongTien.create.mockResolvedValue(MOCK_ITEM);

      const { bienSo, ...dtoKhongCoBienSo } = CREATE_DTO;
      await service.create(dtoKhongCoBienSo as any);

      expect(mockPrisma.phuongTien.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ bienSo: 'Không BKS' }),
        }),
      );
    });
  });

  // ── update ─────────────────────────────────────────────────────────
  describe('update()', () => {
    it('ném NotFoundException khi record không tồn tại', async () => {
      mockPrisma.phuongTien.findFirst.mockResolvedValue(null);

      await expect(service.update(INVALID_ID, UPDATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.phuongTien.update).not.toHaveBeenCalled();
    });

    it('cập nhật và trả về record đã sửa', async () => {
      const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
      mockPrisma.phuongTien.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.phuongTien.update.mockResolvedValue(updated);

      const result = await service.update(VALID_ID, UPDATE_DTO as any);

      expect(result).toEqual(updated);
      expect(mockPrisma.phuongTien.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { ID: VALID_ID },
          data: expect.objectContaining(UPDATE_DTO),
        }),
      );
    });
  });

  // ── remove ─────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('ném NotFoundException khi record không tồn tại', async () => {
      mockPrisma.phuongTien.findFirst.mockResolvedValue(null);
      await expect(service.remove(INVALID_ID)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.phuongTien.update).not.toHaveBeenCalled();
    });

    it('xóa mềm (set isDelete=true) và trả về record đã cập nhật', async () => {
      mockPrisma.phuongTien.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.phuongTien.update.mockResolvedValue({ ...MOCK_ITEM, isDelete: true });

      const result = await service.remove(VALID_ID);

      expect(result).toEqual({ ...MOCK_ITEM, isDelete: true });
      expect(mockPrisma.phuongTien.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { ID: VALID_ID }, data: { isDelete: true } }),
      );
    });
  });

  // ── search ─────────────────────────────────────────────────────────
  describe('search()', () => {
    it('tìm theo biển số (contains) và trả về { total, data }', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([MOCK_ITEM]);
      mockPrisma.phuongTien.count.mockResolvedValue(1);

      const result = await service.search({ ma: '51A' } as any);

      expect(result).toEqual({ total: 1, data: [MOCK_ITEM] });
      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false, bienSo: { contains: '51A' } },
          orderBy: { ID: 'desc' },
          take: 10,
          skip: 0,
        }),
      );
    });

    it('áp dụng limit/offset/sortBy/sort tùy chỉnh', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([]);
      mockPrisma.phuongTien.count.mockResolvedValue(0);

      await service.search({ limit: 5, offset: 10, sortBy: 'ID', sort: 'asc' } as any);

      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { ID: 'asc' }, take: 5, skip: 10 }),
      );
    });

    it('không truyền ma thì chỉ lọc isDelete: false', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([MOCK_ITEM]);
      mockPrisma.phuongTien.count.mockResolvedValue(1);

      await service.search({} as any);

      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDelete: false } }),
      );
    });
  });

  // ── getAllLoadingBalance ──────────────────────────────────────────
  describe('getAllLoadingBalance()', () => {
    it('lấy 15 phần tử đầu khi không truyền id', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([MOCK_ITEM]);

      const result = await service.getAllLoadingBalance();

      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false },
          orderBy: { ID: 'asc' },
          take: 15,
        }),
      );
    });

    it('lấy 15 phần tử tiếp theo kể từ id truyền vào (cursor)', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([MOCK_ITEM]);

      const result = await service.getAllLoadingBalance(VALID_ID);

      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.phuongTien.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false },
          orderBy: { ID: 'asc' },
          take: 15,
          skip: 1,
          cursor: { ID: VALID_ID },
        }),
      );
    });

    it('trả về mảng rỗng khi không còn dữ liệu', async () => {
      mockPrisma.phuongTien.findMany.mockResolvedValue([]);
      expect(await service.getAllLoadingBalance(INVALID_ID)).toEqual([]);
    });
  });
});
