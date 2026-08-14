import { Test, TestingModule } from '@nestjs/testing';
import { NguoiOGhepService } from '../services/nguoi-o-ghep.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('NguoiOGhepService', () => {
  let service: NguoiOGhepService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      hopDong: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn(),
      },
      nguoiOGhep: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
      },
      nguoiThue: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((cb: Function) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NguoiOGhepService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NguoiOGhepService>(NguoiOGhepService);
  });

  describe('themNguoiOGhep', () => {
    const dto = {
      hopDongId: 'HD001',
      danhSachNguoiOGhep: [{ cccd: '001201000111', hoTen: 'Nguyễn Văn A', sdt: '0900000000', quanHeVoiDaiDien: 'Vợ' }],
    };

    it('should throw NotFoundException if hop dong not found', async () => {
      prisma.hopDong.findUnique.mockResolvedValue(null);
      await expect(service.themNguoiOGhep(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if room is full', async () => {
      prisma.hopDong.findUnique.mockResolvedValue({
        hopDongId: 'HD001',
        trangThai: 1,
        phong: { loaiPhong: { soNguoiToiDa: 1 } }, // 1 đại diện đã chiếm hết chỗ
      });
      await expect(service.themNguoiOGhep(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when room is full due to ANOTHER contract sharing the same room', async () => {
      prisma.hopDong.findUnique.mockResolvedValue({
        hopDongId: 'HD001',
        trangThai: 1,
        phong: { phongId: 5, loaiPhong: { soNguoiToiDa: 2 } },
      });
      // Hợp đồng KHÁC (HD002) cùng phòng 5, đang chiếm 2/2 chỗ (1 đại diện + 1 ở ghép)
      prisma.hopDong.findMany.mockResolvedValue([
        {
          hopDongId: 'HD002',
          nguoiOGhep: [{ cccd: '999999999999' }],
        },
      ]);

      await expect(service.themNguoiOGhep(dto)).rejects.toThrow(BadRequestException);
      expect(prisma.nguoiOGhep.upsert).not.toHaveBeenCalled();
    });

    it('should add nguoi o ghep successfully', async () => {
      prisma.hopDong.findUnique.mockResolvedValue({
        hopDongId: 'HD001',
        trangThai: 1,
        phong: { loaiPhong: { soNguoiToiDa: 5 } },
      });
      prisma.nguoiOGhep.upsert.mockResolvedValue({ cccd: dto.danhSachNguoiOGhep[0].cccd, hopDongId: 'HD001' });

      const result = await service.themNguoiOGhep(dto);
      expect(result.success).toBe(true);
      expect(prisma.nguoiOGhep.upsert).toHaveBeenCalled();
    });
  });

  describe('xoaNguoiOGhep', () => {
    it('should throw NotFoundException if not found', async () => {
      prisma.nguoiOGhep.findUnique.mockResolvedValue(null);
      await expect(service.xoaNguoiOGhep('HD001', '001201000111')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if belongs to a different hopDong (khóa kép không khớp -> Prisma trả null)', async () => {
      prisma.nguoiOGhep.findUnique.mockResolvedValue(null);
      await expect(service.xoaNguoiOGhep('HD001', '001201000111')).rejects.toThrow(NotFoundException);
      expect(prisma.nguoiOGhep.findUnique).toHaveBeenCalledWith({
        where: { cccd_hopDongId: { cccd: '001201000111', hopDongId: 'HD001' } },
      });
    });

    it('should soft delete nguoi o ghep', async () => {
      prisma.nguoiOGhep.findUnique.mockResolvedValue({
        cccd: '001201000111',
        hopDongId: 'HD001',
        isDelete: false,
      });
      prisma.nguoiOGhep.update.mockResolvedValue({ cccd: '001201000111', isDelete: true });

      const result = await service.xoaNguoiOGhep('HD001', '001201000111');
      expect(result.success).toBe(true);
      expect(prisma.nguoiOGhep.update).toHaveBeenCalledWith({
        where: { cccd_hopDongId: { cccd: '001201000111', hopDongId: 'HD001' } },
        data: { isDelete: true },
      });
    });
  });
});
