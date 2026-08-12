import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LoaiPhongService } from '../services/loai-phong.service';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Mock Prisma ─────────────────────────────────────────────────────
const mockPrisma = {
  loaiPhong: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  phong: {
    findFirst: jest.fn(),
  },
};

// ─── Fixtures ────────────────────────────────────────────────────────
const VALID_ID = 1;
const INVALID_ID = 9999;

const CREATE_DTO = {
  tenLoaiPhong: 'Tiêu chuẩn',
  dienTich: 25.0,
  isMayLanh: true,
  soNguoiToiDa: 2,
  giaTien: 2000000,
};
const UPDATE_DTO = { maLoaiPhong: VALID_ID, tenLoaiPhong: 'Tiêu chuẩn', giaTien: 2500000, soNguoiToiDa: 3 };
const MOCK_ITEM = { maLoaiPhong: VALID_ID, ...CREATE_DTO, isDelete: false };

describe('LoaiPhongService', () => {
  let service: LoaiPhongService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaiPhongService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<LoaiPhongService>(LoaiPhongService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── findAll ────────────────────────────────────────────────────────
  describe('findAll()', () => {
    it('trả về mảng loại phòng kèm danh sách phòng thuộc loại đó', async () => {
      mockPrisma.loaiPhong.findMany.mockResolvedValue([
        { ...MOCK_ITEM, phong: [{ phongId: 1, tenPhong: 'Phòng 101', trangThai: 0 }] },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(mockPrisma.loaiPhong.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDelete: false },
          include: expect.objectContaining({ phong: expect.anything() }),
        }),
      );
    });

    it('trả về mảng rỗng khi không có dữ liệu', async () => {
      mockPrisma.loaiPhong.findMany.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  // ── findOne ────────────────────────────────────────────────────────
  describe('findOne()', () => {
    it('trả về record khi tìm thấy', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);

      const result = await service.findOne(VALID_ID);

      expect(result).toEqual(MOCK_ITEM);
      expect(mockPrisma.loaiPhong.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { maLoaiPhong: VALID_ID } }),
      );
    });

    it('ném NotFoundException khi không tìm thấy', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);
      await expect(service.findOne(INVALID_ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ─────────────────────────────────────────────────────────
  describe('create()', () => {
    it('ném BadRequestException khi tên loại phòng đã tồn tại', async () => {
      mockPrisma.loaiPhong.findFirst.mockResolvedValue(MOCK_ITEM);

      await expect(service.create(CREATE_DTO as any)).rejects.toThrow(BadRequestException);
      expect(mockPrisma.loaiPhong.create).not.toHaveBeenCalled();
    });

    it('tạo mới thành công khi tên chưa tồn tại', async () => {
      mockPrisma.loaiPhong.findFirst.mockResolvedValue(null);
      mockPrisma.loaiPhong.create.mockResolvedValue(MOCK_ITEM);

      const result = await service.create(CREATE_DTO as any);

      expect(result).toEqual({
        success: true,
        message: 'Thêm mới loại phòng thành công!',
        data: MOCK_ITEM,
      });
      expect(mockPrisma.loaiPhong.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ tenLoaiPhong: 'Tiêu chuẩn', giaTien: 2000000 }),
      });
    });
  });

  // ── update ─────────────────────────────────────────────────────────
  describe('update()', () => {
    it('ném NotFoundException khi loại phòng cần cập nhật không tồn tại', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);

      await expect(service.update(UPDATE_DTO as any)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.loaiPhong.update).not.toHaveBeenCalled();
    });

    it('ném BadRequestException khi tên bị trùng với 1 loại phòng khác', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
      mockPrisma.loaiPhong.findFirst.mockResolvedValue({ maLoaiPhong: 2, tenLoaiPhong: 'Tiêu chuẩn' });

      await expect(service.update(UPDATE_DTO as any)).rejects.toThrow(BadRequestException);
      expect(mockPrisma.loaiPhong.update).not.toHaveBeenCalled();
    });

    it('cập nhật thành công khi không trùng tên với loại phòng khác', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
      mockPrisma.loaiPhong.findFirst.mockResolvedValue(null);
      const updated = { ...MOCK_ITEM, giaTien: 2500000, soNguoiToiDa: 3 };
      mockPrisma.loaiPhong.update.mockResolvedValue(updated);

      const result = await service.update(UPDATE_DTO as any);

      expect(result).toEqual({
        success: true,
        message: 'Cập nhật loại phòng thành công!',
        data: updated,
      });
      expect(mockPrisma.loaiPhong.update).toHaveBeenCalledWith({
        where: { maLoaiPhong: VALID_ID },
        data: expect.objectContaining({ giaTien: 2500000, soNguoiToiDa: 3 }),
      });
    });
  });

  // ── remove ─────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('ném NotFoundException khi loại phòng cần ẩn không tồn tại', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(null);

      await expect(service.remove(INVALID_ID)).rejects.toThrow(NotFoundException);
      expect(mockPrisma.loaiPhong.update).not.toHaveBeenCalled();
    });

    it('ném BadRequestException khi đang có phòng sử dụng loại phòng này', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
      mockPrisma.phong.findFirst.mockResolvedValue({ phongId: 1 });

      await expect(service.remove(VALID_ID)).rejects.toThrow(BadRequestException);
      expect(mockPrisma.loaiPhong.update).not.toHaveBeenCalled();
    });

    it('ẩn (xóa mềm) thành công khi không còn phòng nào dùng loại phòng này', async () => {
      mockPrisma.loaiPhong.findUnique.mockResolvedValue(MOCK_ITEM);
      mockPrisma.phong.findFirst.mockResolvedValue(null);
      mockPrisma.loaiPhong.update.mockResolvedValue({ ...MOCK_ITEM, isDelete: true });

      const result = await service.remove(VALID_ID);

      expect(mockPrisma.loaiPhong.update).toHaveBeenCalledWith({
        where: { maLoaiPhong: VALID_ID },
        data: { isDelete: true },
      });
      expect(result).toEqual({ success: true, message: 'Ẩn loại phòng thành công!' });
    });
  });
});
