import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PhieuThuDienNuocService } from '../services/phieu-thu-dien-nuoc.service';
import { PrismaService } from '../../prisma/prisma.service';
import { HoaDonDienNuocService } from '../../hoa-don-dien-nuoc/services/hoa-don-dien-nuoc.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

const mockThongKeSnapshot = { invalidateAll: jest.fn() };

const mockHoaDonDienNuoc = {
  timTheoLanChot: jest.fn(),
  xoaHoaDon: jest.fn(),
};

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  phieuThuDienNuoc: {
    upsert: jest.fn(),
  },
  dienNuoc: {
    update: jest.fn(),
  },
  $transaction: jest.fn((cb: any) => cb(mockPrisma)),
};

// ─── Fixtures ────────────────────────────────────────────────────────
const PHONG_ID = 1;
const THANG_NAM = '08/2026';
const LAN_GHI = 1;

const CREATE_DTO = {
  phongId: PHONG_ID,
  thangNam: THANG_NAM,
  lanGhi: LAN_GHI,
  soTien: 300000,
  ghiChu: 'Đã thu tiền điện nước',
};

const MOCK_HOA_DON_DN = {
  phongId: PHONG_ID,
  thangNam: THANG_NAM,
  lanGhi: LAN_GHI,
  tongTien: 300000,
};

describe('PhieuThuDienNuocService', () => {
  let service: PhieuThuDienNuocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhieuThuDienNuocService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: HoaDonDienNuocService, useValue: mockHoaDonDienNuoc },
        { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
      ],
    }).compile();

    service = module.get<PhieuThuDienNuocService>(PhieuThuDienNuocService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── create ─────────────────────────────────────────────────────────
  describe('create()', () => {
    it('ném NotFoundException khi không tìm thấy hóa đơn điện nước theo lần chốt', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(null);

      await expect(service.create(CREATE_DTO as any)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.phieuThuDienNuoc.upsert).not.toHaveBeenCalled();
    });

    it('ném BadRequestException khi số tiền thu <= 0', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(MOCK_HOA_DON_DN);

      await expect(
        service.create({ ...CREATE_DTO, soTien: 0 } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném BadRequestException khi số tiền thu không phải là số', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(MOCK_HOA_DON_DN);

      await expect(
        service.create({ ...CREATE_DTO, soTien: 'abc' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('lập phiếu thu thành công (upsert) và invalidate snapshot thống kê', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(MOCK_HOA_DON_DN);
      const phieuThuMoi = { ...CREATE_DTO, ngayThu: new Date() };
      mockPrisma.phieuThuDienNuoc.upsert.mockResolvedValue(phieuThuMoi);

      const result = await service.create(CREATE_DTO as any);

      expect(mockPrisma.phieuThuDienNuoc.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            phongId_thangNam_lanGhi: { phongId: PHONG_ID, thangNam: THANG_NAM, lanGhi: LAN_GHI },
          },
          update: expect.objectContaining({ soTien: 300000, isDelete: false }),
          create: expect.objectContaining({ soTien: 300000 }),
        }),
      );
      expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
      expect(result).toEqual({
        success: true,
        message: 'Lập phiếu thu điện nước thành công!',
        data: phieuThuMoi,
      });
    });
  });

  // ── remove ─────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('ném NotFoundException khi không tìm thấy hóa đơn điện nước', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(null);

      await expect(service.remove(PHONG_ID, THANG_NAM, LAN_GHI)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockHoaDonDienNuoc.xoaHoaDon).not.toHaveBeenCalled();
    });

    it('ném BadRequestException khi đã phát sinh phiếu thu chưa bị xóa', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue({
        ...MOCK_HOA_DON_DN,
        phieuThuDienNuoc: { soTien: 300000, isDelete: false },
      });

      await expect(service.remove(PHONG_ID, THANG_NAM, LAN_GHI)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockHoaDonDienNuoc.xoaHoaDon).not.toHaveBeenCalled();
    });

    it('cho phép xóa khi phiếu thu (nếu có) đã bị xóa mềm từ trước', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue({
        ...MOCK_HOA_DON_DN,
        phieuThuDienNuoc: { soTien: 300000, isDelete: true },
      });
      mockPrisma.dienNuoc.update.mockResolvedValue({ ...MOCK_HOA_DON_DN, TrangThai: 0 });

      const result = await service.remove(PHONG_ID, THANG_NAM, LAN_GHI);

      expect(mockHoaDonDienNuoc.xoaHoaDon).toHaveBeenCalledWith(
        mockPrisma,
        PHONG_ID,
        THANG_NAM,
        LAN_GHI,
      );
      expect(result.success).toBe(true);
    });

    it('xóa hóa đơn điện nước, rollback DienNuoc về TrangThai=0 và invalidate snapshot', async () => {
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue(MOCK_HOA_DON_DN);
      mockPrisma.dienNuoc.update.mockResolvedValue({ ...MOCK_HOA_DON_DN, TrangThai: 0 });

      const result = await service.remove(PHONG_ID, THANG_NAM, LAN_GHI);

      expect(mockHoaDonDienNuoc.xoaHoaDon).toHaveBeenCalledWith(
        mockPrisma,
        PHONG_ID,
        THANG_NAM,
        LAN_GHI,
      );
      expect(mockPrisma.dienNuoc.update).toHaveBeenCalledWith({
        where: {
          phongId_thangNam_lanGhi: { phongId: PHONG_ID, thangNam: THANG_NAM, lanGhi: LAN_GHI },
        },
        data: { TrangThai: 0 },
      });
      expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
      expect(result).toEqual({
        success: true,
        message: `Đã xóa hóa đơn điện nước lần ${LAN_GHI} thành công! Dữ liệu đã được rollback về trạng thái chưa chốt.`,
        data: { ...MOCK_HOA_DON_DN, TrangThai: 0 },
      });
    });
  });
});
