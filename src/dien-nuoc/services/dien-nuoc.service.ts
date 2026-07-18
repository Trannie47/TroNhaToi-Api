import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDienNuocDto } from '../dto/create-dien-nuoc.dto';
import { UpdateDienNuocDto } from '../dto/update-dien-nuoc.dto';
import { SearchDienNuocDto } from '../dto/search-dien-nuoc.dto';
import { generateId } from '../../common/utils/generate-id.util';

@Injectable()
export class DienNuocService {
  constructor(private prisma: PrismaService) {}

  // Lấy dữ liệu khởi tạo cho Điện Nước khi vào chức năng ghi điẹn nước
  async getDienNuocInitData(phongId: number, currentThangNam: string) {
  // kiểm tra phongId có tồn tại
  const phongExists = await this.prisma.phong.findUnique({
    where: { phongId: phongId }
  });
  if (!phongExists) {
    throw new NotFoundException(`Không tìm thấy phòng với ID ${phongId}`);
  }

  // Tìm bản ghi chưa chốt (TrangThai = 0), orderBy lanGhi desc để lấy dòng mới nhất
  const openRecord = await this.prisma.dienNuoc.findFirst({
    where: {
      phongId: phongId,
      thangNam: currentThangNam,
      TrangThai: 0
    },
    orderBy: {lanGhi: 'desc'}
  });

  // TH1 đã ghi nhưng chưa lập hóa đơn -> trả về update
  if (openRecord) {
    return {
      mode: "UPDATE",
      data: openRecord // Gồm cả phongId, thangNam, lanGhi để Flutter gửi ngược lên khi PUT
    };
  }

  // TH2: chưa có hoặc đã lập hóa đơn cho chỉ số trc đó -> trả về create
  // Lấy lịch sử gần nhất
  const latestRecord = await this.prisma.dienNuoc.findFirst({
    where: { phongId: phongId },
    orderBy: [
      { ngayGhi: 'desc' },
      { lanGhi: 'desc' }
    ]
  });

  // Neus Phòng mới tinh chưa từng được ghi chỉ số bao giờ
  if (!latestRecord) {
    return {
      mode: "CREATE",
      data: {
        phongId,
        thangNam: currentThangNam,
        chiSoDienCu: 0,
        chiSoDienMoi: 0,
        chiSoNuocCu: 0,
        chiSoNuocMoi: 0,
        anhDienCu: null,
        anhDienMoi: null,
        anhNuocCu: null,
        anhNuocMoi: null,
        isFirstTime: true
      }
    };
  }

  //Neeus Phòng đã có lịch sử ghi trước đó
  return {
    mode: "CREATE",
    data: {
      phongId,
      thangNam: currentThangNam,
      chiSoDienCu: latestRecord.chiSoDienMoi,
      chiSoDienMoi: 0,
      chiSoNuocCu: latestRecord.chiSoNuocMoi,
      chiSoNuocMoi: 0,
      anhDienCu: latestRecord.anhDienMoi,
      anhDienMoi: null,
      anhNuocCu: latestRecord.anhNuocMoi,
      anhNuocMoi: null,
      isFirstTime: false
    }
  };
}

async createDienNuoc(dto: CreateDienNuocDto) {
    const { phongId, thangNam } = dto; // Lấy thông tin phongId và thangNam từ DTO

    if (!phongId || !thangNam) {
      throw new BadRequestException('Thiếu thông tin phongId hoặc thangNam');
    }

    // Kiểm tra phòng có tồn tại không
    const phongExists = await this.prisma.phong.findUnique({
      where: { phongId: phongId },
    });
    if (!phongExists) {
      throw new NotFoundException(`Không tìm thấy phòng với ID ${phongId}`);
    }

    // Tìm bản ghi cuối cùng của kỳ (tháng/năm) này để xem trạng thái của nó
    const banGhiCuoiInMonth = await this.prisma.dienNuoc.findFirst({
      where: {
        phongId: phongId,
        thangNam: thangNam,
      },
      orderBy: { lanGhi: 'desc' },
    });

    if (banGhiCuoiInMonth && banGhiCuoiInMonth.TrangThai === 0) {
      throw new BadRequestException(
        `Kỳ ${thangNam} đang có bản ghi chưa chốt, vui lòng cập nhật thay vì tạo mới!`,
      );
    }

    const nextLanGhi = banGhiCuoiInMonth ? banGhiCuoiInMonth.lanGhi + 1 : 1;

    // Tạo mới
    return await this.prisma.dienNuoc.create({
      data: {
        phongId: phongId,
        thangNam: thangNam,
        chiSoDienCu: dto.chiSoDienCu ?? 0,
        chiSoDienMoi: dto.chiSoDienMoi ?? 0,
        chiSoNuocCu: dto.chiSoNuocCu ?? 0,
        chiSoNuocMoi: dto.chiSoNuocMoi ?? 0,
        // Lưu cả 4 ảnh cũ/mới phòng trường hợp chủ trọ thay công tơ
        anhDienCu: dto.anhDienCu || null,
        anhDienMoi: dto.anhDienMoi || null,
        anhNuocCu: dto.anhNuocCu || null,
        anhNuocMoi: dto.anhNuocMoi || null,
        lanGhi: nextLanGhi,
        TrangThai: 0, // Mặc định là 0 (Chưa chốt hóa đơn)
       ngayGhi: dto.ngayGhi ? new Date(dto.ngayGhi) : new Date(),
      },
    });
  }

  
}
