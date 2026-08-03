import { Test, TestingModule } from '@nestjs/testing';
import { HopDongNguoiThueService } from '../services/hop-dong-nguoi-thue.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('HopDongNguoiThueService', () => {
  let service: HopDongNguoiThueService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      hopDong: { findUnique: jest.fn() },
      hopDongNguoiThue: {
        count: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      nguoiThue: { updateMany: jest.fn() },
      $transaction: jest.fn((cb: Function) => cb(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HopDongNguoiThueService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<HopDongNguoiThueService>(HopDongNguoiThueService);
  });

  describe('addMember', () => {
    const dto = { hopDongId: 'HD001', danhSachThanhVien: [{ idnt: 1, laDaiDien: false, quanHeVoiDaiDien: 'Vợ' }] };

    it('should throw NotFoundException if hop dong not found', async () => {
      prisma.hopDong.findUnique.mockResolvedValue(null);
      await expect(service.addMember(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if room is full', async () => {
      prisma.hopDong.findUnique.mockResolvedValue({
        hopDongId: 'HD001',
        phong: { loaiPhong: { soNguoiToiDa: 2 } },
      });
      prisma.hopDongNguoiThue.count.mockResolvedValue(2);
      await expect(service.addMember(dto)).rejects.toThrow(BadRequestException);
    });

    it('should add member successfully', async () => {
      prisma.hopDong.findUnique.mockResolvedValue({
        hopDongId: 'HD001',
        phong: { loaiPhong: { soNguoiToiDa: 5 } },
      });
      prisma.hopDongNguoiThue.count.mockResolvedValue(0);
      prisma.hopDongNguoiThue.findUnique.mockResolvedValue(null);
      prisma.hopDongNguoiThue.create.mockResolvedValue({ id: 1, ...dto.danhSachThanhVien[0], hopDongId: 'HD001' });

      const result = await service.addMember(dto);
      expect(result.success).toBe(true);
      expect(prisma.hopDongNguoiThue.create).toHaveBeenCalled();
    });
  });

  describe('removeMember', () => {
    it('should throw NotFoundException if member not found', async () => {
      prisma.hopDongNguoiThue.findUnique.mockResolvedValue(null);
      await expect(service.removeMember('HD001', 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if member is representative', async () => {
      prisma.hopDongNguoiThue.findUnique.mockResolvedValue({ id: 1, laDaiDien: true, isDelete: false });
      await expect(service.removeMember('HD001', 1)).rejects.toThrow(BadRequestException);
    });

    it('should soft delete member', async () => {
      prisma.hopDongNguoiThue.findUnique.mockResolvedValue({ id: 1, laDaiDien: false, isDelete: false });
      prisma.hopDongNguoiThue.update.mockResolvedValue({ id: 1, isDelete: true });
      const result = await service.removeMember('HD001', 1);
      expect(result.success).toBe(true);
      expect(prisma.hopDongNguoiThue.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isDelete: true },
      });
    });
  });

  describe('changeRepresentative', () => {
    it('should change representative successfully', async () => {
      prisma.hopDongNguoiThue.updateMany.mockResolvedValue({ count: 1 });
      prisma.hopDongNguoiThue.findUnique.mockResolvedValue({ id: 2, laDaiDien: false, isDelete: false });
      prisma.hopDongNguoiThue.update.mockResolvedValue({ id: 2, laDaiDien: true });
      const result = await service.changeRepresentative('HD001', 2);
      expect(result.success).toBe(true);
      expect(prisma.hopDongNguoiThue.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { laDaiDien: true },
      });
    });
  });
});
