import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { NguoiLuuTruTamThoiService } from '../services/nguoi-luu-tru-tam-thoi.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  nguoiThue: {
    findFirst: jest.fn(),
  },
  phong: {
    findFirst: jest.fn(),
  },
  nguoiLuuTruTamThoi: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

// ─── Fixtures ────────────────────────────────────────────────────────
const IDNT = 1;
const IDTT = 1;
const PHONG_ID = 2;

const CREATE_DTO = {
  IDNT,
  phongId: PHONG_ID,
  hoTen: 'Trần Thị B',
  moiQuanHe: 'Chị gái',
  cccd: '079987654321',
  sdt: '0912345678',
};

const MOCK_ITEM = {
  idtt: IDTT,
  ...CREATE_DTO,
  ngayDen: new Date('2026-08-01'),
  ngayVe: null,
  isDelete: false,
};

describe('NguoiLuuTruTamThoiService', () => {
  let service: NguoiLuuTruTamThoiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NguoiLuuTruTamThoiService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<NguoiLuuTruTamThoiService>(NguoiLuuTruTamThoiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── taoNguoiLuuTru ─────────────────────────────────────────────────
  describe('taoNguoiLuuTru()', () => {
    it('ném NotFoundException khi người thuê bảo lãnh không tồn tại', async () => {
      mockPrisma.nguoiThue.findFirst.mockResolvedValue(null);

      await expect(service.taoNguoiLuuTru(CREATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.nguoiLuuTruTamThoi.create).not.toHaveBeenCalled();
    });

    it('ném NotFoundException khi phongId truyền vào nhưng phòng không tồn tại', async () => {
      mockPrisma.nguoiThue.findFirst.mockResolvedValue({ idnt: IDNT });
      mockPrisma.phong.findFirst.mockResolvedValue(null);

      await expect(service.taoNguoiLuuTru(CREATE_DTO as any)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.nguoiLuuTruTamThoi.create).not.toHaveBeenCalled();
    });

    it('tạo thành công, không cần kiểm tra phòng khi không truyền phongId', async () => {
      mockPrisma.nguoiThue.findFirst.mockResolvedValue({ idnt: IDNT });
      mockPrisma.nguoiLuuTruTamThoi.create.mockResolvedValue(MOCK_ITEM);

      const { phongId, ...dtoKhongCoPhong } = CREATE_DTO;
      const result = await service.taoNguoiLuuTru(dtoKhongCoPhong as any);

      expect(mockPrisma.phong.findFirst).not.toHaveBeenCalled();
      expect(result).toEqual(MOCK_ITEM);
    });

    it('tạo thành công với đầy đủ dữ liệu, mặc định ngayDen là hôm nay khi không truyền', async () => {
      mockPrisma.nguoiThue.findFirst.mockResolvedValue({ idnt: IDNT });
      mockPrisma.phong.findFirst.mockResolvedValue({ phongId: PHONG_ID });
      mockPrisma.nguoiLuuTruTamThoi.create.mockResolvedValue(MOCK_ITEM);

      const result = await service.taoNguoiLuuTru(CREATE_DTO as any);

      expect(mockPrisma.nguoiLuuTruTamThoi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            IDNT,
            phongId: PHONG_ID,
            hoTen: 'Trần Thị B',
            ngayDen: expect.any(Date),
            ngayVe: null,
          }),
          include: { phong: true, nguoithue: true },
        }),
      );
      expect(result).toEqual(MOCK_ITEM);
    });
  });

  // ── getDanhSachLuuTru ──────────────────────────────────────────────
  describe('getDanhSachLuuTru()', () => {
    it('trả về toàn bộ danh sách khi không truyền idnt', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findMany.mockResolvedValue([MOCK_ITEM]);

      const result = await service.getDanhSachLuuTru();

      expect(result).toEqual([MOCK_ITEM]);
      expect(mockPrisma.nguoiLuuTruTamThoi.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDelete: false } }),
      );
    });

    it('lọc theo IDNT khi có truyền idnt', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findMany.mockResolvedValue([MOCK_ITEM]);

      await service.getDanhSachLuuTru(IDNT);

      expect(mockPrisma.nguoiLuuTruTamThoi.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isDelete: false, IDNT } }),
      );
    });
  });

  // ── getChiTietLuuTru ───────────────────────────────────────────────
  describe('getChiTietLuuTru()', () => {
    it('ném NotFoundException khi không tìm thấy', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(null);

      await expect(service.getChiTietLuuTru(9999)).rejects.toThrow(NotFoundException);
    });

    it('trả về đúng record khi tìm thấy', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(MOCK_ITEM);

      const result = await service.getChiTietLuuTru(IDTT);

      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.nguoiLuuTruTamThoi.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { idtt: IDTT, isDelete: false } }),
      );
    });
  });

  // ── capNhatLuuTru ──────────────────────────────────────────────────
  describe('capNhatLuuTru()', () => {
    it('ném NotFoundException khi bản ghi không tồn tại', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(null);

      await expect(
        service.capNhatLuuTru(9999, { sdt: '0988888888' } as any),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrisma.nguoiLuuTruTamThoi.update).not.toHaveBeenCalled();
    });

    it('chỉ cập nhật các field được truyền, giữ nguyên các field còn lại', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.nguoiLuuTruTamThoi.update.mockResolvedValue({
        ...MOCK_ITEM,
        sdt: '0988888888',
      });

      const result = await service.capNhatLuuTru(IDTT, { sdt: '0988888888' } as any);

      expect(mockPrisma.nguoiLuuTruTamThoi.update).toHaveBeenCalledWith({
        where: { idtt: IDTT },
        data: { sdt: '0988888888' },
        include: { phong: true, nguoithue: true },
      });
      expect(result.sdt).toBe('0988888888');
    });
  });

  // ── xoaLuuTru ──────────────────────────────────────────────────────
  describe('xoaLuuTru()', () => {
    it('ném NotFoundException khi bản ghi không tồn tại', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(null);

      await expect(service.xoaLuuTru(9999)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.nguoiLuuTruTamThoi.update).not.toHaveBeenCalled();
    });

    it('xóa mềm thành công (isDelete=true)', async () => {
      mockPrisma.nguoiLuuTruTamThoi.findFirst.mockResolvedValue(MOCK_ITEM);
      mockPrisma.nguoiLuuTruTamThoi.update.mockResolvedValue({
        ...MOCK_ITEM,
        isDelete: true,
      });

      const result = await service.xoaLuuTru(IDTT);

      expect(mockPrisma.nguoiLuuTruTamThoi.update).toHaveBeenCalledWith({
        where: { idtt: IDTT },
        data: { isDelete: true },
      });
      expect(result.isDelete).toBe(true);
    });
  });
});
