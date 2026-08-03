import { Test, TestingModule } from '@nestjs/testing';
import { LapRapService } from '../services/lap-rap.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma: any = {
  $transaction: jest.fn((callback: any) => callback(mockPrisma)),
  phong: {
    findFirst: jest.fn(),
  },
  thietBi: {
    findFirst: jest.fn(),
  },
  lapRap: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};
const mockThongKeSnapshotService = {
  invalidateAll: jest.fn(),
};

// ─── Fixtures ────────────────────────────────────────────────────────
const VALID_ID = 1;
const INVALID_ID = 9999;

const CREATE_DTO = {
  phongId: 1,
  thietBiId: 1,
  ngayLap: '2023-06-15',
  ghiChu: 'Lắp máy lạnh',
};
const UPDATE_DTO = { ghiChu: 'Cập nhật ghi chú' };
const MOCK_ITEM = { id: 1, phongId: 1, thietBiId: 1, ghiChu: null, isDelete: false };

const MOCK_PHONG = { phongId: 1, tenPhong: 'P101', isDelete: false };

describe('LapRapService', () => {
  let service: LapRapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LapRapService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshotService },
      ],
    }).compile();

    service = module.get<LapRapService>(LapRapService);
    jest.clearAllMocks();
    mockPrisma.$transaction = jest.fn((callback: any) => callback(mockPrisma));
  });

  // ── Smoke ──────────────────────────────────────────────────────────
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── findAll ────────────────────────────────────────────────────────
  describe('findAll()', () => {
    it('trả về mảng khi có dữ liệu', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([MOCK_ITEM]);
      const result = await service.findAll();
      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDelete: false } }),
      );
    });

    it('trả về mảng rỗng khi không có dữ liệu', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────
  describe('findOne()', () => {
    it('trả về record khi tìm thấy', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(MOCK_ITEM);
      const result = await service.findOne(VALID_ID);
      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.lapRap.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: VALID_ID, isDelete: false } }),
      );
    });

    it('ném NotFoundException khi không tìm thấy', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      await expect(service.findOne(INVALID_ID)).rejects.toThrow(NotFoundException);
    });

    it('ném NotFoundException với message đúng', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      await expect(service.findOne(INVALID_ID)).rejects.toThrow('không tồn tại');
    });
  });

  // ── create (CRUD cơ bản, không kiểm tra kho) ─────────────────────
  describe('create()', () => {
    it('tạo mới và trả về record, invalidate snapshot đúng 1 lần', async () => {
      mockPrisma.lapRap.create.mockResolvedValue(MOCK_ITEM);
      const result = await service.create(CREATE_DTO as any);
      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.lapRap.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: CREATE_DTO }),
      );
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledTimes(1);
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });

    it('không invalidate khi lệnh ghi thất bại', async () => {
      mockPrisma.lapRap.create.mockRejectedValue(new Error('write failed'));
      await expect(service.create(CREATE_DTO as any)).rejects.toThrow('write failed');
      expect(mockThongKeSnapshotService.invalidateAll).not.toHaveBeenCalled();
    });
  });

  // ── update ─────────────────────────────────────────────────────────
  describe('update()', () => {
    it('cập nhật và trả về record đã sửa', async () => {
      const updated = { ...MOCK_ITEM, ...UPDATE_DTO };
      mockPrisma.lapRap.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.lapRap.update.mockResolvedValue(updated);

      const result = await service.update(VALID_ID, UPDATE_DTO as any);
      expect(result).toEqual(updated);
      expect(mockPrisma.lapRap.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: VALID_ID }, data: UPDATE_DTO }),
      );
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledTimes(1);
    });

    it('ném NotFoundException khi record không tồn tại', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      await expect(service.update(INVALID_ID, UPDATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('không gọi prisma.update khi record không tồn tại', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      try {
        await service.update(INVALID_ID, UPDATE_DTO as any);
      } catch {}
      expect(mockPrisma.lapRap.update).not.toHaveBeenCalled();
      expect(mockThongKeSnapshotService.invalidateAll).not.toHaveBeenCalled();
    });
  });

  // ── remove ─────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('xóa mềm (set isDelete=true) và trả về record đã cập nhật', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.lapRap.update.mockResolvedValue({ ...MOCK_ITEM, isDelete: true });

      const result = await service.remove(VALID_ID);
      expect(result).toEqual({ ...MOCK_ITEM, isDelete: true });
      expect(mockPrisma.lapRap.update).toHaveBeenCalledWith({
        where: { id: VALID_ID },
        data: { isDelete: true },
      });
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledTimes(1);
    });

    it('ném NotFoundException khi record không tồn tại', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      await expect(service.remove(INVALID_ID)).rejects.toThrow(NotFoundException);
    });

    it('không gọi prisma.update khi record không tồn tại', async () => {
      mockPrisma.lapRap.findFirst.mockResolvedValue(null);
      try {
        await service.remove(INVALID_ID);
      } catch {}
      expect(mockPrisma.lapRap.update).not.toHaveBeenCalled();
    });
  });

  // ── taoLapRap: nghiệp vụ lắp ráp thiết bị vào phòng (kiểm tra kho) ──
  describe('taoLapRap()', () => {
    it('ném NotFoundException khi phòng không tồn tại', async () => {
      mockPrisma.phong.findFirst.mockResolvedValue(null);
      await expect(service.taoLapRap(CREATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.thietBi.findFirst).not.toHaveBeenCalled();
    });

    it('ném NotFoundException khi thiết bị không tồn tại', async () => {
      mockPrisma.phong.findFirst.mockResolvedValue(MOCK_PHONG);
      mockPrisma.thietBi.findFirst.mockResolvedValue(null);
      await expect(service.taoLapRap(CREATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ném BadRequestException khi kho không đủ số lượng', async () => {
      mockPrisma.phong.findFirst.mockResolvedValue(MOCK_PHONG);
      mockPrisma.thietBi.findFirst.mockResolvedValue({
        thietBiId: 1,
        lichSuMua: [{ soLuong: 2 }],
        laprap: [{ id: 1 }, { id: 2 }], // đã lắp hết 2/2
      });

      await expect(service.taoLapRap(CREATE_DTO as any)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.lapRap.create).not.toHaveBeenCalled();
    });

    it('tạo lắp ráp thành công khi kho còn hàng, invalidate đúng 1 lần', async () => {
      mockPrisma.phong.findFirst.mockResolvedValue(MOCK_PHONG);
      mockPrisma.thietBi.findFirst.mockResolvedValue({
        thietBiId: 1,
        lichSuMua: [{ soLuong: 5 }],
        laprap: [{ id: 1 }], // đã lắp 1/5, còn 4
      });
      mockPrisma.lapRap.create.mockResolvedValue({
        id: 10,
        phongId: 1,
        thietBiId: 1,
        ghiChu: 'Lắp máy lạnh',
        isDelete: false,
        thietbi: { thietBiId: 1, tenThietBi: 'Máy lạnh', isDelete: false },
      });

      const result = await service.taoLapRap(CREATE_DTO as any);

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledTimes(1);
      expect(mockThongKeSnapshotService.invalidateAll).toHaveBeenCalledWith(mockPrisma);

      // Kết quả trả về đã transform: bỏ isDelete, đổi thietbi -> thietBi với key thietBiID
      expect(result).toEqual(
        expect.objectContaining({
          id: 10,
          phongId: 1,
          thietBiId: 1,
          thietBi: expect.objectContaining({
            thietBiID: 1,
            tenThietBi: 'Máy lạnh',
          }),
        }),
      );
      expect(result).not.toHaveProperty('isDelete');
    });

    it('trả về thietBi: null nếu bản ghi lắp ráp không kèm thông tin thiết bị', async () => {
      mockPrisma.phong.findFirst.mockResolvedValue(MOCK_PHONG);
      mockPrisma.thietBi.findFirst.mockResolvedValue({
        thietBiId: 1,
        lichSuMua: [{ soLuong: 3 }],
        laprap: [],
      });
      mockPrisma.lapRap.create.mockResolvedValue({
        id: 11,
        phongId: 1,
        thietBiId: 1,
        ghiChu: null,
        isDelete: false,
        thietbi: null,
      });

      const result = await service.taoLapRap(CREATE_DTO as any);
      expect(result.thietBi).toBeNull();
    });
  });

  // ── search ─────────────────────────────────────────────────────────
  describe('search()', () => {
    it('lọc theo phongId và thietBiId khi truyền vào', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([MOCK_ITEM]);
      mockPrisma.lapRap.count.mockResolvedValue(1);

      const result = await service.search({ phongId: 1, thietBiId: 1 } as any);

      expect(result).toEqual({ total: 1, data: [MOCK_ITEM] });
      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false, phongId: 1, thietBiId: 1 },
          orderBy: { id: 'desc' },
          take: 10,
          skip: 0,
        }),
      );
    });

    it('không truyền gì thì chỉ lọc isDelete: false', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([]);
      mockPrisma.lapRap.count.mockResolvedValue(0);

      await service.search({} as any);

      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDelete: false } }),
      );
    });

    it('áp dụng đúng sortBy, sort, limit, offset tùy chỉnh', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([]);
      mockPrisma.lapRap.count.mockResolvedValue(0);

      await service.search({
        sortBy: 'phongId',
        sort: 'asc',
        limit: 5,
        offset: 20,
      } as any);

      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { phongId: 'asc' },
          take: 5,
          skip: 20,
        }),
      );
    });
  });

  // ── getAllLoadingBalance ──────────────────────────────────────────
  describe('getAllLoadingBalance()', () => {
    it('lấy 15 phần tử đầu khi không truyền id', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([MOCK_ITEM]);
      const result = await service.getAllLoadingBalance();
      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false },
          orderBy: { id: 'asc' },
          take: 15,
        }),
      );
      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.not.objectContaining({ cursor: expect.anything() }),
      );
    });

    it('lấy 15 phần tử tiếp theo kể từ id truyền vào (cursor)', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([MOCK_ITEM]);
      const result = await service.getAllLoadingBalance(VALID_ID);
      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.lapRap.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false },
          orderBy: { id: 'asc' },
          take: 15,
          skip: 1,
          cursor: { id: VALID_ID },
        }),
      );
    });

    it('trả về mảng rỗng khi không còn dữ liệu', async () => {
      mockPrisma.lapRap.findMany.mockResolvedValue([]);
      expect(await service.getAllLoadingBalance(INVALID_ID)).toEqual([]);
    });
  });
});