import { Test, TestingModule } from '@nestjs/testing';
import { SuaChuaJobService } from '../services/sua-chua-job.service';
import { ThongBaoService } from '../services/thong-bao.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────
const mockPrisma = {
  suaChua: {
    findMany: jest.fn(),
    updateMany: jest.fn(),
  },
};

// ─── Mock ThongBaoService ─────────────────────────────────────────────────────
const mockThongBaoService = {
  upsertSuaChuaNotification: jest.fn(),
  emitSuaChua: jest.fn(),
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const TODAY = new Date('2026-06-30T00:00:00.000Z');

const makeSuaChua = (
  id: number,
  daysAgo: number,
  opts?: {
    hoadonsuachua?: { trangThai: number; isDelete: boolean } | null;
    trangThaiThongBao?: number;
  },
) => {
  const ngaySuaChua = new Date(TODAY);
  ngaySuaChua.setDate(ngaySuaChua.getDate() - daysAgo);
  return {
    id,
    ngaySuaChua,
    nguyenNhan: 'Máy lạnh không hoạt động',
    trangThaiThongBao: opts?.trangThaiThongBao ?? 0,
    thietbi: { tenThietBi: 'Máy lạnh' },
    lapRap: { id: 1, phong: { phongId: 101, tenPhong: 'Phòng 101' } },
    hoadonsuachua:
      opts?.hoadonsuachua === undefined ? null : opts.hoadonsuachua,
  };
};

const MOCK_TB = {
  id: 1,
  hopDongId: 'SUACHUA_1',
  soNgayCon: 8,
  daDoc: false,
  taoLuc: TODAY,
};

describe('SuaChuaJobService', () => {
  let service: SuaChuaJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuaChuaJobService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ThongBaoService, useValue: mockThongBaoService },
      ],
    }).compile();

    service = module.get<SuaChuaJobService>(SuaChuaJobService);
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(TODAY);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── Không có sự cố nào cần đánh dấu khẩn cấp ─────────────────────────────
  describe('khi không có sự cố sửa chữa nào quá hạn', () => {
    beforeEach(() => {
      mockPrisma.suaChua.findMany.mockResolvedValue([]);
    });

    it('không gọi updateMany', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockPrisma.suaChua.updateMany).not.toHaveBeenCalled();
    });

    it('không gọi upsertSuaChuaNotification', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.upsertSuaChuaNotification).not.toHaveBeenCalled();
    });

    it('không gọi emitSuaChua', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.emitSuaChua).not.toHaveBeenCalled();
    });
  });

  // ── Có sự cố quá hạn xử lý ───────────────────────────────────────────────
  describe('khi có sự cố sửa chữa quá 7 ngày chưa xử lý xong', () => {
    const SC_8_NGAY_CHUA_CO_HOA_DON = makeSuaChua(1, 8);
    const SC_10_NGAY_DANG_SUA = makeSuaChua(2, 10, {
      hoadonsuachua: { trangThai: 0, isDelete: false },
    });

    beforeEach(() => {
      mockPrisma.suaChua.findMany.mockResolvedValue([
        SC_8_NGAY_CHUA_CO_HOA_DON,
        SC_10_NGAY_DANG_SUA,
      ]);
      mockPrisma.suaChua.updateMany.mockResolvedValue({ count: 2 });
      mockThongBaoService.upsertSuaChuaNotification.mockResolvedValue(MOCK_TB);
    });

    it('query prisma với ngaySuaChua <= mốc 7 ngày trước', async () => {
      await service.kiemTraSuaChuaKhanCap();

      const call = mockPrisma.suaChua.findMany.mock.calls[0][0];
      expect(call.where.isDelete).toBe(false);
      expect(call.where.ngaySuaChua.lte).toEqual(expect.any(Date));
    });

    it('lọc theo OR: chưa có hóa đơn hoặc hóa đơn chưa hoàn thành (không thuộc trangThai 2/3/4)', async () => {
      await service.kiemTraSuaChuaKhanCap();

      const call = mockPrisma.suaChua.findMany.mock.calls[0][0];
      expect(call.where.OR).toEqual(
        expect.arrayContaining([
          { hoadonsuachua: null },
          expect.objectContaining({
            hoadonsuachua: expect.objectContaining({
              isDelete: false,
              trangThai: { notIn: [2, 3, 4] },
            }),
          }),
        ]),
      );
    });

    it('gọi updateMany đánh dấu trangThaiThongBao = 1 cho các sự cố chưa được đánh dấu', async () => {
      await service.kiemTraSuaChuaKhanCap();

      expect(mockPrisma.suaChua.updateMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
        data: { trangThaiThongBao: 1 },
      });
    });

    it('gọi upsertSuaChuaNotification đúng số lần với mỗi sự cố', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.upsertSuaChuaNotification).toHaveBeenCalledTimes(2);
    });

    it('truyền đúng suaChuaId, tenThietBi, tenPhong, nguyenNhan cho upsert', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.upsertSuaChuaNotification).toHaveBeenCalledWith(
        1,
        expect.any(Number),
        'Máy lạnh',
        'Phòng 101',
        'Máy lạnh không hoạt động',
      );
    });

    it('tính soNgayTre là số dương', async () => {
      await service.kiemTraSuaChuaKhanCap();
      const firstCall = mockThongBaoService.upsertSuaChuaNotification.mock.calls[0];
      expect(firstCall[1]).toBeGreaterThanOrEqual(7);
    });

    it('gọi emitSuaChua đúng 1 lần sau khi upsert xong', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.emitSuaChua).toHaveBeenCalledTimes(1);
    });

    it('emitSuaChua chứa đủ số lượng thông báo', async () => {
      await service.kiemTraSuaChuaKhanCap();
      const emitArg = mockThongBaoService.emitSuaChua.mock.calls[0][0];
      expect(emitArg).toHaveLength(2);
    });

    it('payload emit kèm suaChuaId, tenThietBi, tenPhong, ngaySuaChua, soNgayTre', async () => {
      await service.kiemTraSuaChuaKhanCap();
      const emitArg = mockThongBaoService.emitSuaChua.mock.calls[0][0];
      expect(emitArg[0]).toMatchObject({
        suaChuaId: 1,
        tenThietBi: 'Máy lạnh',
        tenPhong: 'Phòng 101',
        ngaySuaChua: SC_8_NGAY_CHUA_CO_HOA_DON.ngaySuaChua,
      });
      expect(emitArg[0].soNgayTre).toBeGreaterThanOrEqual(7);
    });
  });

  // ── Sự cố đã được đánh dấu Gấp từ trước ──────────────────────────────────
  describe('khi sự cố đã có trangThaiThongBao = 1 sẵn', () => {
    const SC_DA_GAP = makeSuaChua(3, 9, { trangThaiThongBao: 1 });

    beforeEach(() => {
      mockPrisma.suaChua.findMany.mockResolvedValue([SC_DA_GAP]);
      mockThongBaoService.upsertSuaChuaNotification.mockResolvedValue(MOCK_TB);
    });

    it('không gọi updateMany vì đã được đánh dấu Gấp từ trước', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockPrisma.suaChua.updateMany).not.toHaveBeenCalled();
    });

    it('vẫn tạo thông báo và emit cho sự cố đã Gấp (để cập nhật lại soNgayTre)', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockThongBaoService.upsertSuaChuaNotification).toHaveBeenCalledTimes(1);
      expect(mockThongBaoService.emitSuaChua).toHaveBeenCalledTimes(1);
    });
  });

  // ── Sự cố đã hoàn thành (trangThai 2/3/4) không được tính ────────────────
  describe('khi sự cố đã có hóa đơn hoàn thành/thanh toán/hủy', () => {
    beforeEach(() => {
      // Giả lập kết quả Prisma trả về rỗng vì where đã lọc loại các bản ghi này ở DB
      mockPrisma.suaChua.findMany.mockResolvedValue([]);
    });

    it('không đánh dấu và không emit', async () => {
      await service.kiemTraSuaChuaKhanCap();
      expect(mockPrisma.suaChua.updateMany).not.toHaveBeenCalled();
      expect(mockThongBaoService.emitSuaChua).not.toHaveBeenCalled();
    });
  });

  // ── triggerManual ────────────────────────────────────────────────────────
  describe('triggerManual()', () => {
    it('gọi kiemTraSuaChuaKhanCap và chạy đúng logic', async () => {
      mockPrisma.suaChua.findMany.mockResolvedValue([]);
      await service.triggerManual();
      expect(mockPrisma.suaChua.findMany).toHaveBeenCalledTimes(1);
    });
  });
});