import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DienNuocService } from '../services/dien-nuoc.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  phong: {
    findUnique: jest.fn(),
  },
  dienNuoc: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
};

// ─── Fixtures ────────────────────────────────────────────────────────
const PHONG_ID = 1;
const PHONG_KHONG_TON_TAI = 999;
const THANG_NAM = '08/2026';

const MOCK_PHONG = { phongId: PHONG_ID, tenPhong: 'Phòng 101' };

const CREATE_DTO = {
  phongId: PHONG_ID,
  thangNam: THANG_NAM,
  chiSoDienCu: 100,
  chiSoDienMoi: 150,
  chiSoNuocCu: 20,
  chiSoNuocMoi: 25,
};

describe('DienNuocService', () => {
  let service: DienNuocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DienNuocService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<DienNuocService>(DienNuocService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── getDienNuocInitData ───────────────────────────────────────────
  describe('getDienNuocInitData()', () => {
    it('ném NotFoundException khi không tìm thấy phòng', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(null);

      await expect(
        service.getDienNuocInitData(PHONG_KHONG_TON_TAI, THANG_NAM),
      ).rejects.toThrow(NotFoundException);
    });

    it('mode UPDATE khi kỳ này đang có bản ghi chưa chốt (TrangThai=0)', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      const openRecord = { phongId: PHONG_ID, thangNam: THANG_NAM, lanGhi: 1, TrangThai: 0 };
      mockPrisma.dienNuoc.findFirst.mockResolvedValueOnce(openRecord);

      const result = await service.getDienNuocInitData(PHONG_ID, THANG_NAM);

      expect(result).toEqual({ mode: 'UPDATE', data: openRecord });
    });

    it('mode CREATE, isFirstTime=true khi phòng chưa từng ghi chỉ số lần nào', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.dienNuoc.findFirst
        .mockResolvedValueOnce(null) // openRecord: không có
        .mockResolvedValueOnce(null); // oldestRecord: không có

      const result = await service.getDienNuocInitData(PHONG_ID, THANG_NAM);

      expect(result.mode).toBe('CREATE');
      expect((result.data as any).isFirstTime).toBe(true);
      expect(result.data.chiSoDienCu).toBe(0);
    });

    it('mode CREATE, lấy chỉ số mới của lần chốt gần nhất (TrangThai=1) làm chỉ số cũ', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      const oldestRecord = { chiSoDienMoi: 50, chiSoNuocMoi: 5, anhDienMoi: null, anhNuocMoi: null };
      const latestRecord = {
        chiSoDienMoi: 150,
        chiSoNuocMoi: 25,
        anhDienMoi: 'anh-dien.jpg',
        anhNuocMoi: 'anh-nuoc.jpg',
      };
      mockPrisma.dienNuoc.findFirst
        .mockResolvedValueOnce(null) // openRecord
        .mockResolvedValueOnce(oldestRecord) // oldestRecord
        .mockResolvedValueOnce(latestRecord); // latestRecord (TrangThai=1)

      const result = await service.getDienNuocInitData(PHONG_ID, THANG_NAM);

      expect(result.mode).toBe('CREATE');
      expect((result.data as any).isFirstTime).toBe(false);
      expect(result.data.chiSoDienCu).toBe(150);
      expect(result.data.chiSoNuocCu).toBe(25);
      expect(result.data.anhDienCu).toBe('anh-dien.jpg');
    });

    it('mode CREATE, fallback dùng chỉ số của bản ghi cũ nhất khi chưa từng chốt hóa đơn nào', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      const oldestRecord = { chiSoDienMoi: 50, chiSoNuocMoi: 5, anhDienMoi: 'anh-cu.jpg', anhNuocMoi: null };
      mockPrisma.dienNuoc.findFirst
        .mockResolvedValueOnce(null) // openRecord
        .mockResolvedValueOnce(oldestRecord) // oldestRecord
        .mockResolvedValueOnce(null); // latestRecord: không có bản ghi chốt nào

      const result = await service.getDienNuocInitData(PHONG_ID, THANG_NAM);

      expect(result.mode).toBe('CREATE');
      expect(result.data.chiSoDienCu).toBe(50);
      expect(result.data.chiSoNuocCu).toBe(5);
      expect(result.data.anhDienCu).toBe('anh-cu.jpg');
    });
  });

  // ── createDienNuoc ─────────────────────────────────────────────────
  describe('createDienNuoc()', () => {
    it('ném BadRequestException khi thiếu phongId hoặc thangNam', async () => {
      await expect(
        service.createDienNuoc({ ...CREATE_DTO, phongId: undefined } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném NotFoundException khi phòng không tồn tại', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(null);

      await expect(service.createDienNuoc(CREATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ném BadRequestException khi chỉ số điện mới nhỏ hơn chỉ số điện cũ', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);

      await expect(
        service.createDienNuoc({ ...CREATE_DTO, chiSoDienCu: 100, chiSoDienMoi: 50 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném BadRequestException khi chỉ số nước mới nhỏ hơn chỉ số nước cũ', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);

      await expect(
        service.createDienNuoc({ ...CREATE_DTO, chiSoNuocCu: 20, chiSoNuocMoi: 10 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném BadRequestException khi kỳ này đang có bản ghi chưa chốt', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.dienNuoc.findFirst.mockResolvedValue({ lanGhi: 1, TrangThai: 0 });

      await expect(service.createDienNuoc(CREATE_DTO as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('tạo mới thành công với lanGhi kế tiếp bản ghi cuối cùng của kỳ', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.dienNuoc.findFirst.mockResolvedValue({ lanGhi: 2, TrangThai: 1 });
      mockPrisma.dienNuoc.create.mockImplementation(({ data }: any) => Promise.resolve(data));

      const result = await service.createDienNuoc(CREATE_DTO as any);

      expect(mockPrisma.dienNuoc.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ lanGhi: 3, TrangThai: 0 }) }),
      );
      expect(result.lanGhi).toBe(3);
    });

    it('lanGhi = 1 khi đây là bản ghi đầu tiên của kỳ', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.dienNuoc.findFirst.mockResolvedValue(null);
      mockPrisma.dienNuoc.create.mockImplementation(({ data }: any) => Promise.resolve(data));

      const result = await service.createDienNuoc(CREATE_DTO as any);

      expect(result.lanGhi).toBe(1);
    });
  });

  // ── updateDienNuoc ─────────────────────────────────────────────────
  describe('updateDienNuoc()', () => {
    it('ném NotFoundException khi không tìm thấy bản ghi', async () => {
      mockPrisma.dienNuoc.findFirst.mockResolvedValue(null);

      await expect(
        service.updateDienNuoc(PHONG_ID, THANG_NAM, 1, {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('ném BadRequestException khi bản ghi đã chốt hóa đơn (TrangThai=1)', async () => {
      mockPrisma.dienNuoc.findFirst.mockResolvedValue({
        phongId: PHONG_ID,
        thangNam: THANG_NAM,
        lanGhi: 1,
        TrangThai: 1,
      });

      await expect(
        service.updateDienNuoc(PHONG_ID, THANG_NAM, 1, { chiSoDienMoi: 200 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném BadRequestException khi chỉ số điện mới nhỏ hơn chỉ số điện cũ', async () => {
      mockPrisma.dienNuoc.findFirst.mockResolvedValue({
        phongId: PHONG_ID,
        thangNam: THANG_NAM,
        lanGhi: 1,
        TrangThai: 0,
        chiSoDienCu: 100,
        chiSoDienMoi: 150,
        chiSoNuocCu: 20,
        chiSoNuocMoi: 25,
      });

      await expect(
        service.updateDienNuoc(PHONG_ID, THANG_NAM, 1, { chiSoDienMoi: 50 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('cập nhật thành công và trả về bản ghi mới nhất', async () => {
      const banGhiHienTai = {
        phongId: PHONG_ID,
        thangNam: THANG_NAM,
        lanGhi: 1,
        TrangThai: 0,
        chiSoDienCu: 100,
        chiSoDienMoi: 150,
        chiSoNuocCu: 20,
        chiSoNuocMoi: 25,
      };
      const banGhiSauKhiSua = { ...banGhiHienTai, chiSoDienMoi: 200 };

      mockPrisma.dienNuoc.findFirst
        .mockResolvedValueOnce(banGhiHienTai) // tìm bản ghi cần sửa
        .mockResolvedValueOnce(banGhiSauKhiSua); // trả về bản ghi sau khi cập nhật

      const result = await service.updateDienNuoc(PHONG_ID, THANG_NAM, 1, {
        chiSoDienMoi: 200,
      } as any);

      expect(mockPrisma.dienNuoc.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { phongId: PHONG_ID, thangNam: THANG_NAM, lanGhi: 1 },
          data: expect.objectContaining({ chiSoDienMoi: 200 }),
        }),
      );
      expect(result).toEqual(banGhiSauKhiSua);
    });
  });
});
