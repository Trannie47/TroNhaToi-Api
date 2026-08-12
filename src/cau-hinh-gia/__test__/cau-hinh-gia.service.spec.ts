import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CauHinhGiaService } from '../services/cau-hinh-gia.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  cauHinhGia: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
};

const MOCK_CAU_HINH = {
  id: 1,
  giaDien: 3500,
  giaNuoc: 15000,
  giaXeMay: 50000,
  giaXeHoi: 200000,
  giaXeDap: 20000,
};

describe('CauHinhGiaService', () => {
  let service: CauHinhGiaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CauHinhGiaService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<CauHinhGiaService>(CauHinhGiaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── getGiaHienTai ──────────────────────────────────────────────────
  describe('getGiaHienTai()', () => {
    it('trả về cấu hình giá mới nhất khi đã có dữ liệu', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(MOCK_CAU_HINH);

      const result = await service.getGiaHienTai();

      expect(result).toEqual(MOCK_CAU_HINH);
      expect(mockPrisma.cauHinhGia.findFirst).toHaveBeenCalledWith({
        orderBy: { id: 'desc' },
      });
    });

    it('trả về giá mặc định (id=0) khi chưa từng cấu hình', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(null);

      const result = await service.getGiaHienTai();

      expect(result.id).toBe(0);
      expect(result.giaDien).toBe(0);
      expect(result.giaNuoc).toBe(0);
    });
  });

  // ── updateGia ──────────────────────────────────────────────────────
  describe('updateGia()', () => {
    it('cập nhật (update) cấu hình hiện có nếu đã tồn tại 1 bản ghi', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(MOCK_CAU_HINH);
      mockPrisma.cauHinhGia.update.mockResolvedValue({ ...MOCK_CAU_HINH, giaDien: 4000 });

      const result = await service.updateGia({ giaDien: 4000, giaNuoc: 15000 } as any);

      expect(mockPrisma.cauHinhGia.update).toHaveBeenCalledWith({
        where: { id: MOCK_CAU_HINH.id },
        data: expect.objectContaining({ giaDien: 4000, giaNuoc: 15000 }),
      });
      expect(mockPrisma.cauHinhGia.create).not.toHaveBeenCalled();
      expect(result.giaDien).toBe(4000);
    });

    it('giữ nguyên giá xe cũ khi không truyền giá xe mới', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(MOCK_CAU_HINH);
      mockPrisma.cauHinhGia.update.mockResolvedValue(MOCK_CAU_HINH);

      await service.updateGia({ giaDien: 4000, giaNuoc: 15000 } as any);

      expect(mockPrisma.cauHinhGia.update).toHaveBeenCalledWith({
        where: { id: MOCK_CAU_HINH.id },
        data: expect.objectContaining({
          giaXeMay: MOCK_CAU_HINH.giaXeMay,
          giaXeHoi: MOCK_CAU_HINH.giaXeHoi,
          giaXeDap: MOCK_CAU_HINH.giaXeDap,
        }),
      });
    });

    it('tạo mới (create) khi chưa từng có cấu hình nào', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(null);
      mockPrisma.cauHinhGia.create.mockResolvedValue({ id: 1, giaDien: 4000, giaNuoc: 15000 });

      const result = await service.updateGia({ giaDien: 4000, giaNuoc: 15000 } as any);

      expect(mockPrisma.cauHinhGia.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ giaDien: 4000, giaNuoc: 15000 }),
      });
      expect(mockPrisma.cauHinhGia.update).not.toHaveBeenCalled();
      expect(result.id).toBe(1);
    });
  });

  // ── getGiaXeTheoLoai ───────────────────────────────────────────────
  describe('getGiaXeTheoLoai()', () => {
    it('trả về đúng giá mặc định theo từng loại xe (0: máy, 1: ô tô, 2: đạp)', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(MOCK_CAU_HINH);

      await expect(service.getGiaXeTheoLoai(0)).resolves.toEqual({
        loaiXe: 0,
        giaMacDinh: MOCK_CAU_HINH.giaXeMay,
      });
      await expect(service.getGiaXeTheoLoai(1)).resolves.toEqual({
        loaiXe: 1,
        giaMacDinh: MOCK_CAU_HINH.giaXeHoi,
      });
      await expect(service.getGiaXeTheoLoai(2)).resolves.toEqual({
        loaiXe: 2,
        giaMacDinh: MOCK_CAU_HINH.giaXeDap,
      });
    });

    it('ném BadRequestException khi loại xe không hợp lệ', async () => {
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(MOCK_CAU_HINH);

      await expect(service.getGiaXeTheoLoai(99)).rejects.toThrow(BadRequestException);
    });
  });
});
