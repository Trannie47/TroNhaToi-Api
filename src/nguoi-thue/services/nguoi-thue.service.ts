import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNguoiThueDto } from '../dto/create-nguoi-thue.dto';
import { UpdateNguoiThueDto } from '../dto/update-nguoi-thue.dto';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';

@Injectable()
export class NguoiThueService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshotService: ThongKeSnapshotService,
  ) { }

  //Lấy tất cả người thuê bao gồm những người vừa thêm vào và chưa có hợp đồng nào và sắp xếp đẩy người mới thêm lên đầu
  async findAllNguoiThue() {
    return this.prisma.nguoiThue.findMany({
      where: { isDelete: false },
      orderBy: { idnt: 'desc' },
    });
  }
    private tinhTuoi(ngaySinh: Date, mocTinhTuoi: Date): number {
    let tuoi = mocTinhTuoi.getFullYear() - ngaySinh.getFullYear();
    const chuaDenSinhNhat =
      mocTinhTuoi.getMonth() < ngaySinh.getMonth() ||
      (mocTinhTuoi.getMonth() === ngaySinh.getMonth() &&
        mocTinhTuoi.getDate() < ngaySinh.getDate());

    if (chuaDenSinhNhat) {
      tuoi -= 1;
    }

    return tuoi;
  }

  private parseMocTinhTuoi(ngayKy?: string): Date {
    if (!ngayKy) {
      return new Date();
    }

    const mocTinhTuoi = new Date(ngayKy);
    if (Number.isNaN(mocTinhTuoi.getTime())) {
      throw new BadRequestException('Ngày ký hợp đồng không hợp lệ.');
    }

    return mocTinhTuoi;
  }

  // Danh sách người đủ điều kiện làm người đại diện hợp đồng.
  // Người đang có hợp đồng khác vẫn được phép xuất hiện vì có thể đứng tên nhiều hợp đồng.
  async getNguoiThueAvailableForRepresentative(ngayKy?: string) {
    const mocTinhTuoi = this.parseMocTinhTuoi(ngayKy);
    const danhSach = await this.prisma.nguoiThue.findMany({
      where: { isDelete: false },
      select: {
        idnt: true,
        hoTen: true,
        ngaySinh: true,
        trangThai: true,
      },
      orderBy: { hoTen: 'asc' },
    });

    return danhSach
      .filter((nguoiThue) => {
        if (!nguoiThue.ngaySinh) {
          return false;
        }

        return this.tinhTuoi(nguoiThue.ngaySinh, mocTinhTuoi) >= 18;
      })
      .map((nguoiThue) => ({
        ...nguoiThue,
        tuoi: this.tinhTuoi(nguoiThue.ngaySinh!, mocTinhTuoi),
        coTheLamDaiDien: true,
      }));
  }

  // Danh sách người có thể thêm là thành viên ở cùng.
  // Không giới hạn tuổi, nhưng không hiển thị người đang thuộc một hợp đồng hoạt động khác.
  // excludeHopDongId: khi đang sửa 1 hợp đồng, bỏ qua ràng buộc từ chính hợp đồng đó để
  // các thành viên hiện tại của nó không bị loại nhầm khỏi danh sách khả dụng.
  async getNguoiThueAvailableForMember(excludeIdnt?: number, excludeHopDongId?: string) {
    const thanhVienDangHoatDong = await this.prisma.hopDongNguoiThue.findMany({
      where: {
        isDelete: false,
        ...(excludeHopDongId ? { hopDongId: { not: excludeHopDongId } } : {}),
        hopDong: {
          isDelete: false,
          trangThai: { in: [0, 1] },
        },
      },
      select: { idnt: true },
    });

    const danhSachIdntDaCoPhong = thanhVienDangHoatDong.map((item) => item.idnt);
    const danhSachIdntCanLoai = excludeIdnt === undefined
      ? danhSachIdntDaCoPhong
      : [...danhSachIdntDaCoPhong, excludeIdnt];

    const danhSach = await this.prisma.nguoiThue.findMany({
      where: {
        isDelete: false,
        ...(danhSachIdntCanLoai.length > 0
          ? { idnt: { notIn: danhSachIdntCanLoai } }
          : {}),
      },
      select: {
        idnt: true,
        hoTen: true,
        ngaySinh: true,
        trangThai: true,
      },
      orderBy: { hoTen: 'asc' },
    });

    return danhSach.map((nguoiThue) => ({
      ...nguoiThue,
      tuoi: nguoiThue.ngaySinh
        ? this.tinhTuoi(nguoiThue.ngaySinh, new Date())
        : null,
      coTheLamThanhVien: true,
    }));
  }

  async getNguoiThueAvailableForContract(ngayKy?: string) {
    return this.getNguoiThueAvailableForRepresentative(ngayKy);
  }
  async findRoom_NguoiThue(id: number) {
    const listHopDong = await this.prisma.hopDong.findMany({
            where: {
        isDelete: false,
        trangThai: { not: 2 },
        hopDongNguoiThue: {
          some: { idnt: id, isDelete: false },
        },
      },
      include: {
        phong: {
          include: {
            loaiPhong: true,
          }
        },
        hopDongNguoiThue: {
          where: { idnt: id, isDelete: false },
          include: { nguoithue: true },
        },
      }
    });
    return listHopDong.filter((hd) => hd.phong !== null && hd.isDelete === false); // list lấy cả thông tin  hợp đồng, phòng và loại phòng theo id người thuê
  }

  async findOne(id: number) {
    const item = await this.prisma.nguoiThue.findUnique({
      where: { idnt: id },
      // include: { hopDong: { include: { phong: true } }, phuongTien: true },
    });
    if (!item) throw new NotFoundException(`NguoiThue với id ${id} không tồn tại`);
    return item;
  }

  create(dto: CreateNguoiThueDto) {
    return this.prisma.$transaction(async (tx) => {
      const nguoiThue = await tx.nguoiThue.create({
        data: {
          ...dto,
          ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : null,
        } as any,
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return nguoiThue;
    });
  }

  async update(id: number, dto: UpdateNguoiThueDto) {
    // Tìm xem người thuê có tồn tại không
    const tenant = await this.findOne(id);

    //Nếu trạng thái là 2 (Đã dọn đi) thì báo lỗi ngay
    if (tenant.trangThai === 2) {
      throw new BadRequestException(
        'Không thể cập nhật! Người thuê này đã dọn đi và không còn hoạt động trong hệ thống.',
      );
    }

    //Chuẩn hóa lại ngày sinh nếu người dùng có chỉnh sửa ngày sinh dạng chuỗi
    const updateData = {
      ...dto,
      ngaySinh: dto.ngaySinh ? new Date(dto.ngaySinh) : tenant.ngaySinh,
    };

    //Tiến hành cập nhật thông tin dữ liệu xuống Database
    return this.prisma.$transaction(async (tx) => {
      const nguoiThue = await tx.nguoiThue.update({
        where: { idnt: id },
        data: updateData as any,
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return nguoiThue;
    });
  }

  async remove(id: number) {
    const tenant = await this.prisma.nguoiThue.findUnique({
      where: { idnt: id },
    });
    if (!tenant) {
      throw new NotFoundException(`Người thuê với id ${id} không tồn tại`);
    }
        const hasHopDong = await this.prisma.hopDongNguoiThue.findFirst({
      where: {
        idnt: id,
        isDelete: false,
        hopDong: { isDelete: false, trangThai: { not: 2 } },
      },
    });
    if (hasHopDong) {
      throw new BadRequestException(`Không thể xóa người thuê có hợp đồng đang hoạt động`);
    }
    return this.prisma.$transaction(async (tx) => {
      const nguoiThue = await tx.nguoiThue.update({
        where: { idnt: id },
        data: { isDelete: true },
      });
      await this.thongKeSnapshotService.invalidateAll(tx);
      return nguoiThue;
    });
  }

  async getNguoiThueCongNoTapHoa() {
    const nguoiThues = await this.prisma.nguoiThue.findMany({
      where: {
        isDelete: false,
      },
      include: {
        hoaDonTapHoa: {
          where: {
            isDelete: false,
          },
          include: {
            phieuThuHdTh: {
              where: {
                isDelete: false,
              },
              select: {
                soTien: true,
              },
            },
          },
        },
      },
    });

    return nguoiThues
      .map((nguoiThue) => {
        const tongCongNoTapHoa = nguoiThue.hoaDonTapHoa.reduce(
          (tongNo, hoaDon) => {
            const daThu = hoaDon.phieuThuHdTh.reduce(
              (sum, pt) => sum + Number(pt.soTien),
              0,
            );

            return tongNo + (Number(hoaDon.tongTien) - daThu);
          },
          0,
        );

        const { hoaDonTapHoa, ...data } = nguoiThue;

        return {
          ...data,
          tongCongNoTapHoa,
        };
      })
      .filter((item) => item.tongCongNoTapHoa > 0);
  }
}
