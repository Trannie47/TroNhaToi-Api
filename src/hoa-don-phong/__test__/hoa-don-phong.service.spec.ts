import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { HoaDonPhongService } from '../services/hoa-don-phong.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { HoaDonDienNuocService } from '../../hoa-don-dien-nuoc/services/hoa-don-dien-nuoc.service';

const mockThongKeSnapshot = { invalidateAll: jest.fn() };

const mockHoaDonDienNuoc = {
  timTheoLanChot: jest.fn(),
  layDanhSachChuaThanhToan: jest.fn(),
  layDanhSachTheoThangDeHienThi: jest.fn(),
  chotHoaDon: jest.fn(),
};

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  phong: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  cauHinhGia: {
    findFirst: jest.fn(),
  },
  dienNuoc: {
    findFirst: jest.fn(),
    create: jest.fn(),
    updateMany: jest.fn(),
  },
  hopDong: {
    findMany: jest.fn(),
  },
  phuongTien: {
    findMany: jest.fn(),
  },
  hoaDonPhong: {
    count: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  hoaDonGuiXe: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn((cb: any) => cb(mockPrisma)),
};

// ─── Fixtures ────────────────────────────────────────────────────────
const PHONG_ID = 1;
const THANG_NAM = '08/2026';
const MA_HOA_DON = 'HD202608-1';

const MOCK_PHONG = {
  phongId: PHONG_ID,
  tenPhong: 'Phòng 101',
  isDelete: false,
  loaiPhong: { giaTien: 2000000 },
};

describe('HoaDonPhongService', () => {
  let service: HoaDonPhongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HoaDonPhongService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ThongKeSnapshotService, useValue: mockThongKeSnapshot },
        { provide: HoaDonDienNuocService, useValue: mockHoaDonDienNuoc },
      ],
    }).compile();

    service = module.get<HoaDonPhongService>(HoaDonPhongService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── getAllDanhSachQuanLyHoaDon ────────────────────────────────────
  describe('getAllDanhSachQuanLyHoaDon()', () => {
    it('gộp danh sách hóa đơn của tất cả phòng, gắn đúng tenPhong và sắp xếp theo ngayLap giảm dần', async () => {
      mockPrisma.phong.findMany.mockResolvedValue([
        { phongId: 1, tenPhong: 'Phòng 101' },
        { phongId: 2, tenPhong: 'Phòng 102' },
      ]);

      jest.spyOn(service, 'getDanhSachByPhong').mockImplementation(async (phongId: number) => {
        if (phongId === 1) {
          return [{ maHoaDon: 'HDA', tenPhong: 'cũ', ngayLap: new Date('2026-08-01') } as any];
        }
        return [{ maHoaDon: 'HDB', tenPhong: 'cũ', ngayLap: new Date('2026-08-05') } as any];
      });

      const result = await service.getAllDanhSachQuanLyHoaDon();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].maHoaDon).toBe('HDB'); 
      expect(result.data[0].tenPhong).toBe('Phòng 102');
      expect(result.data[1].tenPhong).toBe('Phòng 101');
    });
  });

  // ── getHoaDonInitData ─────────────────────────────────────────────
  describe('getHoaDonInitData()', () => {
    it('ném NotFoundException khi không tìm thấy phòng', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(null);

      await expect(service.getHoaDonInitData(PHONG_ID, THANG_NAM)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('dienNuoc.mode = EXISTS khi có bản ghi nháp chưa chốt', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue({ giaDien: 3500, giaNuoc: 15000 });
      mockPrisma.dienNuoc.findFirst.mockResolvedValue({
        lanGhi: 1,
        chiSoDienCu: 100,
        chiSoDienMoi: 150,
        chiSoNuocCu: 20,
        chiSoNuocMoi: 25,
        anhDienMoi: null,
        anhNuocMoi: null,
      });
      mockHoaDonDienNuoc.timTheoLanChot.mockResolvedValue({
        giaDienApDung: 3600,
        giaNuocApDung: 16000,
      });
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);
      mockPrisma.hopDong.findMany.mockResolvedValue([]);

      const result = await service.getHoaDonInitData(PHONG_ID, THANG_NAM);

      expect(result.dienNuoc.mode).toBe('EXISTS');
      expect(result.giaDien).toBe(3600);
      expect(result.giaNuoc).toBe(16000);
      expect(result.danhSachHopDong).toEqual([]);
    });

    it('dienNuoc.mode = NEED_NEW và dùng giá hệ thống khi chưa có bản ghi nháp', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue({ giaDien: 3500, giaNuoc: 15000 });
      mockPrisma.dienNuoc.findFirst
        .mockResolvedValueOnce(null) // banGhiChuaChot: không có
        .mockResolvedValueOnce({ chiSoDienMoi: 150, chiSoNuocMoi: 25 }); // bản ghi đã chốt gần nhất
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);
      mockPrisma.hopDong.findMany.mockResolvedValue([]);

      const result = await service.getHoaDonInitData(PHONG_ID, THANG_NAM);

      expect(result.dienNuoc.mode).toBe('NEED_NEW');
      expect(result.dienNuoc.chiSoDienCu).toBe(150);
      expect(result.giaDien).toBe(3500);
      expect(result.giaNuoc).toBe(15000);
      expect(mockHoaDonDienNuoc.timTheoLanChot).not.toHaveBeenCalled();
    });

    it('trả về danhSachHopDong rỗng khi phòng không có ai đang ở', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue(null);
      mockPrisma.dienNuoc.findFirst.mockResolvedValue(null).mockResolvedValueOnce(null);
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);
      mockPrisma.hopDong.findMany.mockResolvedValue([]); // activeContracts rỗng -> dsNt rỗng

      const result = await service.getHoaDonInitData(PHONG_ID, THANG_NAM);

      expect(result.danhSachHopDong).toEqual([]);
      expect(result.giaDien).toBe(3500); // fallback mặc định khi chưa có cấu hình giá
      expect(result.giaNuoc).toBe(15000);
    });

    it('tính đúng tiền phòng khi hợp đồng ở trọn 1 tháng, không bị chia ngày', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue({ giaDien: 3500, giaNuoc: 15000 });
      mockPrisma.dienNuoc.findFirst.mockResolvedValue(null);
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);

      const hopDong = {
        hopDongId: 'HD01',
        idntDaiDien: 1,
        ngayKy: new Date('2026-07-01'),
        ngayHetHan: new Date('2027-07-01'),
        trangThai: 1,
        giaPhongThucTe: 2000000,
        nguoiDaiDien: { idnt: 1, hoTen: 'Nguyễn A', sdt: '0900000000' },
        nguoiOGhep: [],
        hoaDonPhong: [],
      };

      mockPrisma.hopDong.findMany
        .mockResolvedValueOnce([hopDong]) // activeContracts
        .mockResolvedValueOnce([hopDong]); // danhSachHopDong
      mockPrisma.phuongTien.findMany.mockResolvedValue([]);

      const result = await service.getHoaDonInitData(PHONG_ID, THANG_NAM);

      expect(result.danhSachHopDong).toHaveLength(1);
      expect(result.danhSachHopDong[0].calculatedTienPhong).toBe(2000000);
      expect(result.danhSachHopDong[0].isAlreadyBilled).toBe(false);
    });
  });

  // ── createHoaDonPhong ──────────────────────────────────────────────
  describe('createHoaDonPhong()', () => {
    const baseDto: any = {
      phongId: PHONG_ID,
      thangNam: THANG_NAM,
      isChotDienNuoc: false,
    };

    it('ném BadRequestException khi chốt điện nước nhưng còn hóa đơn điện nước chưa thanh toán', async () => {
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([{ lanGhi: 1 }]);

      await expect(
        service.createHoaDonPhong({ ...baseDto, isChotDienNuoc: true }, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('ném BadRequestException khi chỉ số điện mới nhỏ hơn chỉ số điện cũ', async () => {
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);

      await expect(
        service.createHoaDonPhong(
          { ...baseDto, isChotDienNuoc: true, chiSoDienCu: 100, chiSoDienMoi: 50 },
          {},
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('tạo hóa đơn thành công cho danh sách hợp đồng chưa lập, không chốt điện nước', async () => {
      mockPrisma.phong.findUnique.mockResolvedValue(MOCK_PHONG);
      mockPrisma.cauHinhGia.findFirst.mockResolvedValue({ giaDien: 3500, giaNuoc: 15000 });
      mockPrisma.dienNuoc.findFirst.mockResolvedValue(null);
      mockHoaDonDienNuoc.layDanhSachChuaThanhToan.mockResolvedValue([]);

      const hopDong = {
        hopDongId: 'HD01',
        idntDaiDien: 1,
        ngayKy: new Date('2026-07-01'),
        ngayHetHan: new Date('2027-07-01'),
        trangThai: 1,
        giaPhongThucTe: 2000000,
        nguoiDaiDien: { idnt: 1, hoTen: 'Nguyễn A', sdt: '0900000000' },
        nguoiOGhep: [],
        hoaDonPhong: [],
      };
      mockPrisma.hopDong.findMany
        .mockResolvedValueOnce([hopDong])
        .mockResolvedValueOnce([hopDong]);
      mockPrisma.phuongTien.findMany.mockResolvedValue([]);
      mockPrisma.hoaDonPhong.count.mockResolvedValue(0);
      mockPrisma.hoaDonPhong.create.mockImplementation(({ data }: any) =>
        Promise.resolve({ ...data }),
      );

      const dto: any = {
        ...baseDto,
        danhSachHopDongJson: JSON.stringify([{ hopDongId: 'HD01' }]),
      };

      const result = await service.createHoaDonPhong(dto, {});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(mockPrisma.hoaDonPhong.create).toHaveBeenCalledTimes(1);
      expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
    });
  });

  // ── getDanhSachByPhong ─────────────────────────────────────────────
  describe('getDanhSachByPhong()', () => {
    it('tính đúng tongDaThu/conNo bằng cách cộng dồn mảng phieuThuHangThang', async () => {
      mockPrisma.hoaDonPhong.findMany.mockResolvedValue([
        {
          maHoaDon: MA_HOA_DON,
          hopDongId: 'HD01',
          hopDong: {
            nguoiDaiDien: { hoTen: 'Nguyễn A', sdt: '0900000000' },
            phong: { tenPhong: 'Phòng 101' },
          },
          thangNam: THANG_NAM,
          ngayLap: new Date('2026-08-01'),
          soTien: 2000000,
          trangThai: 1,
          chiTietJson: null,
          phieuThuHangThang: [
            { maPhieuThu: 1, soTien: 500000, ngayThu: new Date('2026-08-02'), ghiChu: '' },
            { maPhieuThu: 2, soTien: 300000, ngayThu: new Date('2026-08-03'), ghiChu: '' },
          ],
        },
      ]);

      mockHoaDonDienNuoc.layDanhSachTheoThangDeHienThi.mockResolvedValue([]);

      const result = await service.getDanhSachByPhong(PHONG_ID, THANG_NAM);

      expect(result).toHaveLength(1);
      expect(result[0].tongDaThu).toBe(800000);
      expect(result[0].conNo).toBe(1200000);
      expect(result[0].phieuThuHangThang).toHaveLength(2);
    });

    it('không gọi điện nước khi không truyền thangNam', async () => {
      mockPrisma.hoaDonPhong.findMany.mockResolvedValue([]);

      const result = await service.getDanhSachByPhong(PHONG_ID);

      expect(result).toEqual([]);
      expect(mockHoaDonDienNuoc.layDanhSachTheoThangDeHienThi).not.toHaveBeenCalled();
    });
  });

  // ── getChiTietHoaDon ───────────────────────────────────────────────
  describe('getChiTietHoaDon()', () => {
    it('ném NotFoundException khi không tìm thấy hóa đơn', async () => {
      mockPrisma.hoaDonPhong.findUnique.mockResolvedValue(null);

      await expect(service.getChiTietHoaDon(MA_HOA_DON)).rejects.toThrow(NotFoundException);
    });

    it('trả về đúng tongDaThu/conNo cộng dồn từ các phiếu thu', async () => {
      mockPrisma.hoaDonPhong.findUnique.mockResolvedValue({
        maHoaDon: MA_HOA_DON,
        soTien: 2000000,
        phieuThuHangThang: [{ soTien: 2000000 }],
      });

      const result = await service.getChiTietHoaDon(MA_HOA_DON);

      expect(result.success).toBe(true);
      expect(result.data.tongDaThu).toBe(2000000);
      expect(result.data.conNo).toBe(0);
    });
  });

  // ── deleteHoaDonPhong ──────────────────────────────────────────────
  describe('deleteHoaDonPhong()', () => {
    it('ném NotFoundException khi hóa đơn không tồn tại hoặc đã bị xóa', async () => {
      mockPrisma.hoaDonPhong.findUnique.mockResolvedValue(null);

      await expect(service.deleteHoaDonPhong(MA_HOA_DON)).rejects.toThrow(NotFoundException);
    });

    it('ném BadRequestException khi hóa đơn đã phát sinh thanh toán (trangThai !== 0)', async () => {
      mockPrisma.hoaDonPhong.findUnique.mockResolvedValue({
        maHoaDon: MA_HOA_DON,
        isDelete: false,
        trangThai: 1,
      });

      await expect(service.deleteHoaDonPhong(MA_HOA_DON)).rejects.toThrow(BadRequestException);
    });

    it('xóa mềm thành công, rollback hóa đơn gửi xe liên quan và invalidate snapshot', async () => {
      mockPrisma.hoaDonPhong.findUnique.mockResolvedValue({
        maHoaDon: MA_HOA_DON,
        isDelete: false,
        trangThai: 0,
        thangNam: THANG_NAM,
        chiTietJson: JSON.stringify({ danhSachXe: [{ id: 5 }] }),
      });
      mockPrisma.hoaDonPhong.update.mockResolvedValue({
        maHoaDon: MA_HOA_DON,
        isDelete: true,
      });

      const result = await service.deleteHoaDonPhong(MA_HOA_DON);

      expect(mockPrisma.hoaDonPhong.update).toHaveBeenCalledWith({
        where: { maHoaDon: MA_HOA_DON },
        data: { isDelete: true },
      });
      expect(mockPrisma.hoaDonGuiXe.updateMany).toHaveBeenCalledWith({
        where: { idPT: 5, thangNam: THANG_NAM, isDelete: false },
        data: { isDelete: true },
      });
      expect(mockThongKeSnapshot.invalidateAll).toHaveBeenCalledWith(mockPrisma);
      expect(result.success).toBe(true);
    });
  });
});
