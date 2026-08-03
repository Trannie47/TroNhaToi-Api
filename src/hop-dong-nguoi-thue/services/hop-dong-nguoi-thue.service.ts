import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHopDongNguoiThueDto } from '../dto/create-hop-dong-nguoi-thue.dto';

@Injectable()
export class HopDongNguoiThueService {
  constructor(private prisma: PrismaService) { }


  async addMember(dto: CreateHopDongNguoiThueDto) {
    // Kiểm tra hợp đồng tồn tại
    const hopDong = await this.prisma.hopDong.findUnique({
      where: { hopDongId: dto.hopDongId, isDelete: false },
      include: { phong: { include: { loaiPhong: true } } },
    });
    if (!hopDong) throw new NotFoundException(`Hợp đồng ${dto.hopDongId} không tồn tại.`);

    // Kiểm tra phòng còn chỗ
    const soNguoiToiDa = hopDong.phong?.loaiPhong?.soNguoiToiDa ?? 99;
    const currentMembers = await this.prisma.hopDongNguoiThue.count({
      where: { hopDongId: dto.hopDongId, isDelete: false },
    });
    if (currentMembers + dto.danhSachThanhVien.length > soNguoiToiDa) {
      throw new BadRequestException(`Phòng chỉ chứa tối đa ${soNguoiToiDa} người.`);
    }

    return await this.prisma.$transaction(async (tx) => {
      const created = [];
      for (const tv of dto.danhSachThanhVien) {
        // Kiểm tra đã tồn tại chưa
        const exist = await tx.hopDongNguoiThue.findUnique({
          where: {
            hopDongId_idnt: { hopDongId: dto.hopDongId, idnt: tv.idnt },
          },
        });
        if (exist) {
          if (exist.isDelete) {
            // Nếu đã xóa mềm thì khôi phục
            const restored = await tx.hopDongNguoiThue.update({
              where: { id: exist.id },
              data: { isDelete: false, laDaiDien: tv.laDaiDien, quanHeVoiDaiDien: tv.quanHeVoiDaiDien },
            });
            created.push(restored);
          } else {
            throw new BadRequestException(`Người thuê ${tv.idnt} đã có trong hợp đồng.`);
          }
        } else {
          const newMember = await tx.hopDongNguoiThue.create({
            data: {
              hopDongId: dto.hopDongId,
              idnt: tv.idnt,
              laDaiDien: tv.laDaiDien,
              quanHeVoiDaiDien: tv.laDaiDien ? null : (tv.quanHeVoiDaiDien ?? null),
            },
          });
          created.push(newMember);
        }

        // Cập nhật trạng thái người thuê thành đang thuê 
        await tx.nguoiThue.updateMany({
          where: { idnt: tv.idnt, trangThai: 0 },
          data: { trangThai: 1 },
        });
      }
      return { success: true, message: 'Thêm thành viên thành công', data: created };
    });
  }


  async removeMember(hopDongId: string, idnt: number) {
    const member = await this.prisma.hopDongNguoiThue.findUnique({
      where: { hopDongId_idnt: { hopDongId, idnt } },
    });
    if (!member || member.isDelete) {
      throw new NotFoundException(`Không tìm thấy thành viên trong hợp đồng.`);
    }
    if (member.laDaiDien) {
      throw new BadRequestException(`Không thể xóa người đại diện. Hãy đổi đại diện trước.`);
    }

    const deleted = await this.prisma.hopDongNguoiThue.update({
      where: { id: member.id },
      data: { isDelete: true },
    });
    return { success: true, message: `Đã xóa thành viên ${idnt} khỏi hợp đồng.`, data: deleted };
  }

 // Đổi người đại diện của hợp đồng
  async changeRepresentative(hopDongId: string, newIdnt: number) {
    return await this.prisma.$transaction(async (tx) => {
      // Bỏ đại diện cũ
      await tx.hopDongNguoiThue.updateMany({
        where: { hopDongId, laDaiDien: true },
        data: { laDaiDien: false },
      });

      // Đặt đại diện mới
      const member = await tx.hopDongNguoiThue.findUnique({
        where: { hopDongId_idnt: { hopDongId, idnt: newIdnt } },
      });
      if (!member || member.isDelete) throw new BadRequestException(`Người thuê ${newIdnt} không có trong hợp đồng.`);

      const updated = await tx.hopDongNguoiThue.update({
        where: { id: member.id },
        data: { laDaiDien: true },
      });
      return { success: true, message: 'Đã đổi người đại diện thành công.', data: updated };
    });
  }
// Lấy danh sách thành viên của hợp đồng
  async getMembersByHopDong(hopDongId: string) {
    const members = await this.prisma.hopDongNguoiThue.findMany({
      where: { hopDongId, isDelete: false },
      include: { nguoithue: true },
    });
    return { success: true, data: members };
  }
}
