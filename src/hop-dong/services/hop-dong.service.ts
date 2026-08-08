import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHopDongDto } from '../dto/create-hop-dong.dto';
import { UpdateHopDongDto } from '../dto/update-hop-dong.dto';
import { SearchHopDongDto } from '../dto/search-hop-dong.dto';
import { GiaHanHopDongDto } from '../dto/renew-hop-dong.dto';
import { ThongKeSnapshotService } from '../../thong-ke/services/thong-ke-snapshot.service';
import { HoaDonDienNuocService } from '../../hoa-don-dien-nuoc/services/hoa-don-dien-nuoc.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HopDongService {
  constructor(
    private prisma: PrismaService,
    private thongKeSnapshotService: ThongKeSnapshotService,
    private hoaDonDienNuoc: HoaDonDienNuocService,
  ) { }

  //Lấy ds hợp đồng
  async findAll() {
    const dsHopDong = await this.prisma.hopDong.findMany({
      where: { isDelete: false },
      include: {
        phong: {
          select: {
            tenPhong: true,
            loaiPhong: {
              select: {
                giaTien: true,
              },
            },
          },
        },
        nguoiDaiDien: { select: { hoTen: true, sdt: true } },
        nguoiOGhep: { where: { isDelete: false } },
      },
      orderBy: {
        ngayKy: 'desc',
      },
    });
    return dsHopDong.map((hd) => ({
      ...hd,
      anhHopDong: hd.anhHopDong ? hd.anhHopDong.split(',') : [], // Chuyển chuỗi ảnh thành mảng
    }));
  }
  //Lấy danh sách phòng available cho việc tạo hợp đồng
  // (bao gồm phòng chưa có hợp đồng và phòng đã có hợp đồng nhưng mà số lượng nhỏ hơn mức cho phép)
  async getRoomsAvailableForContract() {
    const rooms = await this.prisma.phong.findMany({
      where: {
        isDelete: false,
      },
      include: {
        loaiPhong: true,
        HopDong: {
          where: {
            isDelete: false,
            trangThai: { in: [0, 1] },
          },
          include: {
            nguoiOGhep: { where: { isDelete: false }, select: { cccd: true } },
          },
        },
      },
    });

    return rooms
      .map((phong) => {
        // Sức chứa hiện tại = tổng (1 đại diện + số người ở ghép) của từng hợp đồng đang hiệu lực/chờ hiệu lực
        let soNguoiHienTai = 0;
        for (const hopDong of phong.HopDong) {
          soNguoiHienTai += 1 + hopDong.nguoiOGhep.length;
        }

        const soNguoiToiDa = phong.loaiPhong?.soNguoiToiDa ?? null;

        return {
          id: phong.phongId,
          tenPhong: phong.tenPhong,
          giaPhongGoc: phong.loaiPhong?.giaTien ?? 0,
          soNguoiHienTai,
          soNguoiToiDa,
          soChoConLai:
            soNguoiToiDa !== null
              ? Math.max(soNguoiToiDa - soNguoiHienTai, 0)
              : null,
        };
      })
      .filter(
        (phong) =>
          phong.soNguoiToiDa !== null &&
          phong.soNguoiHienTai < phong.soNguoiToiDa,
      );
  }

  async create(dto: CreateHopDongDto, listUrlImage: string[]) {
    // dùng transaction để đảm bảo tính toàn vẹn dữ liệu, nếu có lỗi thì nó tự rollback
    return await this.prisma.$transaction(async (prisma) => {
      const result = await this._createHopDong(prisma, dto, listUrlImage);
      await this.thongKeSnapshotService.invalidateAll(prisma);
      return result;
    });
  }

  //Tạo 1 hàm chung như này để có thể dùng chung, đặc biết trong cái update hợp đồng, vì nếu ko truyền prisma vàodungf chung thì trong update sẽ có tới 2 transaction, mà trong 1 transaction thì ko thể gọi transaction khác được, nên phải dùng chung 1 transaction
  private async _createHopDong(
    prisma: any,
    dto: CreateHopDongDto,
    listUrlImage: string[],
  ) {
    const idntDaiDien = Number(dto.idntDaiDien);
    if (!Number.isInteger(idntDaiDien) || idntDaiDien <= 0) {
      throw new BadRequestException('Thiếu hoặc sai ID người đại diện hợp đồng.');
    }

    const danhSachNguoiOGhep = this.chuanHoaDanhSachNguoiOGhep(dto.danhSachNguoiOGhep);
    const dsCccd = danhSachNguoiOGhep.map((ng) => ng.cccd);
    if (new Set(dsCccd).size !== dsCccd.length) {
      throw new BadRequestException('Danh sách người ở ghép không được có CCCD trùng nhau.');
    }

    const infoPhong = await prisma.phong.findUnique({
      where: { phongId: dto.phongId },
      include: { loaiPhong: true },
    });

    if (!infoPhong || infoPhong.isDelete) {
      throw new BadRequestException('Không tìm thấy phòng thuê hợp lệ để lập hợp đồng.');
    }

    const ngayKy = this.parseNgayTheoLich(dto.ngayKy);
    const ngayHetHan = this.parseNgayTheoLich(dto.ngayHetHan);

    const homNay = this.ngayHomNayTheoLich();
    const trangThaiHopDong = ngayKy <= homNay ? 1 : 0;

    const nguoiDaiDien = await prisma.nguoiThue.findFirst({
      where: { idnt: idntDaiDien, isDelete: false },
      select: { idnt: true, ngaySinh: true },
    });

    if (!nguoiDaiDien) {
      throw new BadRequestException('Người đại diện không tồn tại hoặc đã bị xóa.');
    }

    if (!nguoiDaiDien.ngaySinh) {
      throw new BadRequestException('Người đại diện phải có ngày sinh để kiểm tra đủ 18 tuổi.');
    }

    if (this.tinhTuoi(nguoiDaiDien.ngaySinh, ngayKy) < 18) {
      throw new BadRequestException('Người đại diện hợp đồng phải đủ 18 tuổi.');
    }


    if (dsCccd.length > 0) {
      const dangOGhepNoiKhac = await prisma.nguoiOGhep.findMany({
        where: {
          cccd: { in: dsCccd },
          isDelete: false,
          hopDong: { isDelete: false, trangThai: { in: [0, 1] } },
        },
        select: { cccd: true },
      });

      if (dangOGhepNoiKhac.length > 0) {
        throw new BadRequestException(
          `CCCD đã thuộc hợp đồng đang hoạt động khác: ${dangOGhepNoiKhac
            .map((n: any) => n.cccd)
            .join(', ')}`,
        );
      }
    }

    const soNguoiToiDa = infoPhong.loaiPhong?.soNguoiToiDa;
    if (soNguoiToiDa === null || soNguoiToiDa === undefined) {
      throw new BadRequestException('Loại phòng chưa cấu hình số người tối đa.');
    }

    const hopDongDangHoatDong = await prisma.hopDong.findMany({
      where: {
        phongId: dto.phongId,
        isDelete: false,
        trangThai: { in: [0, 1] },
      },
      include: {
        nguoiOGhep: { where: { isDelete: false }, select: { cccd: true } },
      },
    });

    let soNguoiDangOTrongPhong = 1 + danhSachNguoiOGhep.length; // hợp đồng sắp tạo
    for (const hopDong of hopDongDangHoatDong) {
      soNguoiDangOTrongPhong += 1 + hopDong.nguoiOGhep.length;
    }

    if (soNguoiDangOTrongPhong > soNguoiToiDa) {
      throw new BadRequestException('Số lượng người thuê vượt quá sức chứa của phòng.');
    }

    const countHopDongCuaPhong = await prisma.hopDong.count({
      where: { phongId: dto.phongId },
    });
    const soThuTuNext = countHopDongCuaPhong + 1;
    const nam = ngayKy.getFullYear();
    const thang = String(ngayKy.getMonth() + 1).padStart(2, '0');
    const maHopDongFormat = `${nam}${thang}-${infoPhong.phongId}-${soThuTuNext}`;
    const chuoiImageConTract = listUrlImage.length > 0 ? listUrlImage.join(',') : '';

    try {
      const newHopDong = await prisma.hopDong.create({
        data: {
          hopDongId: maHopDongFormat,
          phongId: dto.phongId,
          idntDaiDien,
          ngayKy,
          ngayHetHan,
          tienCoc: dto.tienCoc ?? 0,
          giaPhongThucTe: dto.giaPhongThucTe ?? 0,
          trangThai: trangThaiHopDong,
          ghiChu: dto.ghiChu ?? '',
          anhHopDong: chuoiImageConTract,
        },
      });

      if (danhSachNguoiOGhep.length > 0) {
        await prisma.nguoiOGhep.createMany({
          data: danhSachNguoiOGhep.map((ng) => ({
            cccd: ng.cccd,
            hoTen: ng.hoTen,
            sdt: ng.sdt,
            quanHeVoiDaiDien: ng.quanHeVoiDaiDien,
            hopDongId: newHopDong.hopDongId,
            isDelete: false,
          })),
        });
      }

      await prisma.phong.update({
        where: { phongId: dto.phongId },
        data: { trangThai: 1 },
      });

      await prisma.nguoiThue.update({
        where: { idnt: idntDaiDien },
        data: { trangThai: 1 },
      });

      const data = await prisma.hopDong.findUnique({
        where: { hopDongId: newHopDong.hopDongId },
        include: {
          nguoiDaiDien: true,
          nguoiOGhep: { where: { isDelete: false } },
        },
      });

      return {
        success: true,
        message: trangThaiHopDong === 1
          ? 'Tạo mới và kích hoạt hợp đồng thành công!'
          : 'Tạo hợp đồng chờ hiệu lực thành công!',
        data,
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      console.error('Lỗi hệ thống khi xử lý lưu hợp đồng:', error);
      throw new InternalServerErrorException(
        'Không thể hoàn tất lưu hợp đồng do lỗi hệ thống',
      );
    }
  }

  async update(id: string, dto: UpdateHopDongDto, listUrlImage: string[]) {
    const existingHopDong = await this.prisma.hopDong.findFirst({
      where: { hopDongId: id, isDelete: false },
    });

    if (!existingHopDong) {
      throw new NotFoundException(`Hợp đồng với id ${id} không tồn tại`);
    }

    if (existingHopDong.trangThai === 2) {
      throw new BadRequestException('Hợp đồng đã kết thúc, không thể cập nhật.');
    }

    if (dto.phongId !== undefined && dto.phongId !== existingHopDong.phongId) {
      throw new BadRequestException(
        'Không thể chuyển hợp đồng sang phòng khác. Vui lòng tạo hợp đồng mới.',
      );
    }

    const phongId = existingHopDong.phongId;
    if (phongId === null || phongId === undefined) {
      throw new BadRequestException('Hợp đồng chưa được gắn với phòng.');
    }

    const idntDaiDienMoi =
      dto.idntDaiDien !== undefined ? Number(dto.idntDaiDien) : existingHopDong.idntDaiDien;
    if (!Number.isInteger(idntDaiDienMoi) || idntDaiDienMoi <= 0) {
      throw new BadRequestException('ID người đại diện không hợp lệ.');
    }

    let danhSachDauVao = dto.danhSachNguoiOGhep;
    if (danhSachDauVao === undefined) {
      danhSachDauVao = await this.prisma.nguoiOGhep.findMany({
        where: { hopDongId: id, isDelete: false },
        select: { cccd: true, hoTen: true, sdt: true, quanHeVoiDaiDien: true },
      });
    }

    const danhSachNguoiOGhepMoi = this.chuanHoaDanhSachNguoiOGhep(danhSachDauVao);
    const dsCccdMoi = danhSachNguoiOGhepMoi.map((ng) => ng.cccd);
    if (new Set(dsCccdMoi).size !== dsCccdMoi.length) {
      throw new BadRequestException('Danh sách người ở ghép không được có CCCD trùng nhau.');
    }

    const ngayKy = dto.ngayKy
      ? this.parseNgayTheoLich(dto.ngayKy)
      : this.parseNgayTheoLich(existingHopDong.ngayKy);
    const ngayHetHan = dto.ngayHetHan
      ? this.parseNgayTheoLich(dto.ngayHetHan)
      : this.parseNgayTheoLich(existingHopDong.ngayHetHan);

    if (ngayHetHan < ngayKy) {
      throw new BadRequestException('Ngày hết hạn phải lớn hơn hoặc bằng ngày ký.');
    }

    const nguoiDaiDienMoi = await this.prisma.nguoiThue.findFirst({
      where: { idnt: idntDaiDienMoi, isDelete: false },
      select: { idnt: true, ngaySinh: true },
    });

    if (!nguoiDaiDienMoi?.ngaySinh) {
      throw new BadRequestException(
        'Người đại diện phải có ngày sinh để kiểm tra đủ 18 tuổi.',
      );
    }

    if (this.tinhTuoi(nguoiDaiDienMoi.ngaySinh, ngayKy) < 18) {
      throw new BadRequestException('Người đại diện hợp đồng phải đủ 18 tuổi.');
    }

    return this.prisma.$transaction(async (prisma) => {
      if (dsCccdMoi.length > 0) {
        const dangOGhepNoiKhac = await prisma.nguoiOGhep.findMany({
          where: {
            cccd: { in: dsCccdMoi },
            hopDongId: { not: id },
            isDelete: false,
            hopDong: { isDelete: false, trangThai: { in: [0, 1] } },
          },
          select: { cccd: true },
        });

        if (dangOGhepNoiKhac.length > 0) {
          throw new BadRequestException(
            `CCCD đã thuộc hợp đồng đang hoạt động khác: ${dangOGhepNoiKhac
              .map((n: any) => n.cccd)
              .join(', ')}`,
          );
        }
      }

      const phong = await prisma.phong.findUnique({
        where: { phongId },
        include: { loaiPhong: true },
      });
      const soNguoiToiDa = phong?.loaiPhong?.soNguoiToiDa;
      if (soNguoiToiDa === null || soNguoiToiDa === undefined) {
        throw new BadRequestException('Loại phòng chưa cấu hình số người tối đa.');
      }

      const hopDongKhacTrongPhong = await prisma.hopDong.findMany({
        where: {
          phongId,
          hopDongId: { not: id },
          isDelete: false,
          trangThai: { in: [0, 1] },
        },
        include: {
          nguoiOGhep: { where: { isDelete: false }, select: { cccd: true } },
        },
      });

      let soNguoiTrongPhong = 1 + danhSachNguoiOGhepMoi.length; // hợp đồng đang sửa
      for (const hopDong of hopDongKhacTrongPhong) {
        soNguoiTrongPhong += 1 + hopDong.nguoiOGhep.length;
      }

      if (soNguoiTrongPhong > soNguoiToiDa) {
        throw new BadRequestException(`Phòng chỉ chứa tối đa ${soNguoiToiDa} người.`);
      }

      const tienCocMoi = dto.tienCoc ?? existingHopDong.tienCoc ?? 0;
      const giaPhongMoi =
        dto.giaPhongThucTe ?? existingHopDong.giaPhongThucTe ?? 0;
      const thayDoiGia =
        Number(tienCocMoi) !== Number(existingHopDong.tienCoc ?? 0) ||
        Number(giaPhongMoi) !== Number(existingHopDong.giaPhongThucTe ?? 0);

      const homNay = this.ngayHomNayTheoLich();
      const ngayKyHienTai = this.parseNgayTheoLich(existingHopDong.ngayKy);
      // Chỉ coi là "đã có thời gian hiệu lực với giá cũ" khi ngày ký hiện tại thực sự ở quá khứ.
      // Nếu ngày ký = hôm nay (vừa tạo) hoặc còn ở tương lai (đang chờ hiệu lực) thì đổi giá/tiền cọc
      // cũng không được tách phiên bản mới, tránh sinh hợp đồng cũ có ngày kết thúc đứng trước ngày ký.
      const daHieuLucTuTruoc = ngayKyHienTai.getTime() < homNay.getTime();
      const canTaoPhienBanMoiDoGia = thayDoiGia && daHieuLucTuTruoc;

      const anhHopDongMoi = listUrlImage.join(',');
      const anhHopDongCu = existingHopDong.anhHopDong ?? '';
      const anhHopDong = anhHopDongMoi
        ? [anhHopDongCu, anhHopDongMoi].filter(Boolean).join(',')
        : anhHopDongCu;

      let hopDongIdMoi = id;
      let hopDongKetQua;

      const idntDaiDienCu = existingHopDong.idntDaiDien;

      if (!canTaoPhienBanMoiDoGia) {
        hopDongKetQua = await prisma.hopDong.update({
          where: { hopDongId: id },
          data: {
            phongId,
            idntDaiDien: idntDaiDienMoi,
            ngayKy,
            ngayHetHan,
            tienCoc: tienCocMoi,
            giaPhongThucTe: giaPhongMoi,
            ghiChu: dto.ghiChu ?? existingHopDong.ghiChu,
            anhHopDong,
            trangThai: existingHopDong.trangThai,
          },
        });

        // Người ở ghép bị gỡ khỏi hợp đồng này
        const nguoiOGhepTruocKhiSua = await prisma.nguoiOGhep.findMany({
          where: { hopDongId: id, isDelete: false },
          select: { cccd: true },
        });
        const cccdBiGo = nguoiOGhepTruocKhiSua
          .map((ng: any) => ng.cccd)
          .filter((cccd: string) => !dsCccdMoi.includes(cccd));

        if (cccdBiGo.length > 0) {
          await prisma.nguoiOGhep.updateMany({
            where: { hopDongId: id, cccd: { in: cccdBiGo }, isDelete: false },
            data: { isDelete: true },
          });
        }


        for (const ng of danhSachNguoiOGhepMoi) {
          await prisma.nguoiOGhep.upsert({
            where: { cccd_hopDongId: { cccd: ng.cccd, hopDongId: id } },
            update: {
              hoTen: ng.hoTen,
              sdt: ng.sdt,
              quanHeVoiDaiDien: ng.quanHeVoiDaiDien,
              isDelete: false,
            },
            create: {
              cccd: ng.cccd,
              hoTen: ng.hoTen,
              sdt: ng.sdt,
              quanHeVoiDaiDien: ng.quanHeVoiDaiDien,
              hopDongId: id,
              isDelete: false,
            },
          });
        }
      } else {
        // Ngày bắt đầu hợp đồng mới luôn là hôm nay (không lấy ngày ký cũ/dto) để ngày kết thúc
        // hợp đồng cũ (hôm nay - 1) không bao giờ đứng trước ngày ký của chính hợp đồng cũ đó.
        const ngayKyMoi = homNay;
        const ngayKetThucCu = new Date(homNay);
        ngayKetThucCu.setDate(ngayKetThucCu.getDate() - 1);

        if (ngayHetHan < ngayKyMoi) {
          throw new BadRequestException(
            'Ngày hết hạn phải lớn hơn hoặc bằng ngày bắt đầu của phiên bản hợp đồng mới (hôm nay).',
          );
        }

        await prisma.hopDong.update({
          where: { hopDongId: id },
          data: {
            trangThai: 2,
            ngayHetHan: ngayKetThucCu,
          },
        });

        const countHopDongCuaPhong = await prisma.hopDong.count({
          where: { phongId },
        });
        const nam = ngayKyMoi.getFullYear();
        const thang = String(ngayKyMoi.getMonth() + 1).padStart(2, '0');
        hopDongIdMoi = `${nam}${thang}-${phongId}-${countHopDongCuaPhong + 1}`;

        hopDongKetQua = await prisma.hopDong.create({
          data: {
            hopDongId: hopDongIdMoi,
            phongId,
            idntDaiDien: idntDaiDienMoi,
            ngayKy: ngayKyMoi,
            ngayHetHan,
            tienCoc: tienCocMoi,
            giaPhongThucTe: giaPhongMoi,
            trangThai: 1,
            ghiChu: dto.ghiChu ?? existingHopDong.ghiChu,
            anhHopDong,
          },
        });


        if (danhSachNguoiOGhepMoi.length > 0) {
          await prisma.nguoiOGhep.createMany({
            data: danhSachNguoiOGhepMoi.map((ng) => ({
              cccd: ng.cccd,
              hoTen: ng.hoTen,
              sdt: ng.sdt,
              quanHeVoiDaiDien: ng.quanHeVoiDaiDien,
              hopDongId: hopDongIdMoi,
              isDelete: false,
            })),
          });
        }
      }

      await prisma.phong.update({
        where: { phongId },
        data: { trangThai: 1 },
      });

      await prisma.nguoiThue.update({
        where: { idnt: idntDaiDienMoi },
        data: { trangThai: 1 },
      });


      if (idntDaiDienCu !== idntDaiDienMoi) {
        const conHopDongKhac = await prisma.hopDong.findFirst({
          where: {
            idntDaiDien: idntDaiDienCu,
            hopDongId: { not: id },
            isDelete: false,
            trangThai: { in: [0, 1] },
          },
        });

        if (!conHopDongKhac) {
          await prisma.nguoiThue.update({
            where: { idnt: idntDaiDienCu },
            data: { trangThai: 0 },
          });
        }
      }

      await this.thongKeSnapshotService.invalidateAll(prisma);

      return {
        success: true,
        message: thayDoiGia
          ? 'Cập nhật giá thành công, đã tạo phiên bản hợp đồng mới.'
          : 'Cập nhật hợp đồng thành công.',
        data: await prisma.hopDong.findUnique({
          where: { hopDongId: hopDongIdMoi },
          include: {
            nguoiDaiDien: true,
            nguoiOGhep: { where: { isDelete: false } },
          },
        }),
      };
    });
  }

  // Lấy danh sách lịch sử hợp đồng đã kết thúc của một phòng
  async getLichSuThuePhong(phongId: number) {
    const phongExists = await this.prisma.phong.findUnique({
      where: { phongId: phongId },
    });
    if (!phongExists) {
      throw new NotFoundException(`Không tìm thấy phòng với ID ${phongId}`);
    }
    return await this.prisma.hopDong.findMany({
      where: {
        phongId: phongId,
        trangThai: 2, // 2: đã kết thúc
      },
      include: {
        nguoiDaiDien: { select: { hoTen: true, sdt: true } },
        nguoiOGhep: { where: { isDelete: false } },
      },
      orderBy: {
        ngayHetHan: 'desc', // Hợp đồng nào mới kết thúc gần đây nhất thì hiện lên đầu
      },
    });
  }

  async giaHan(id: string, dto: GiaHanHopDongDto, listUrlImage: string[]) {
    //Kiểm tra sự tồn tại của hợp đồng
    const existingHopDong = await this.prisma.hopDong.findFirst({
      where: { hopDongId: id, isDelete: false },
    });

    if (!existingHopDong) {
      throw new NotFoundException(`Hợp đồng với ID ${id} không tồn tại`);
    }

    //Chặn gia hạn nếu hợp đồng chưa có hiệu lực (trangThai = 0)
    if (existingHopDong.trangThai === 0) {
      throw new BadRequestException(
        'Hợp đồng chưa có hiệu lực, không thể gia hạn. Vui lòng chọn "Cập nhật hợp đồng"!',
      );
    }

    //Chặn gia hạn nếu hợp đồng đã kết thúc (trangThai = 2)
    if (existingHopDong.trangThai === 2) {
      throw new BadRequestException(
        'Hợp đồng này đã kết thúc, không thể gia hạn. Vui lòng tạo hợp đồng mới!',
      );
    }

    //Check điều kiện thời gian: CHỈ CHO GIA HẠN KHI CÒN <= 30 NGÀY
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);

    const ngayHetHanCu = new Date(existingHopDong.ngayHetHan);
    ngayHetHanCu.setHours(0, 0, 0, 0);

    // Tính số ngày còn lại đến hạn
    const diffTime = ngayHetHanCu.getTime() - homNay.getTime();
    const soNgayConLai = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Nếu còn hơn 30 ngày mới tới hạn -> Chặn
    if (soNgayConLai > 30) {
      throw new BadRequestException(
        `Hợp đồng vẫn còn ${soNgayConLai} ngày nữa mới hết hạn. Chỉ được gia hạn khi còn từ 30 ngày trở xuống!`,
      );
    }

    //Ngày hết hạn mới phải LỚN HƠN ngày hết hạn hiện tại
    const ngayOnly = dto.ngayHetHanMoi.split('T')[0];
    const stringNgay = `${ngayOnly}T00:00:00.000Z`;

    const ngayHetHanMoi = new Date(stringNgay);

    if (ngayHetHanMoi <= ngayHetHanCu) {
      throw new BadRequestException(
        'Ngày hết hạn mới phải lớn hơn ngày hết hạn hiện tại của hợp đồng!',
      );
    }

    //CỘNG DỒN ảnh mới vào danh sách ảnh cũ
    let chuoiAnhUpdated = existingHopDong.anhHopDong ?? '';
    if (listUrlImage.length > 0) {
      const chuoiAnhMoi = listUrlImage.join(',');
      chuoiAnhUpdated = chuoiAnhUpdated
        ? `${chuoiAnhUpdated},${chuoiAnhMoi}`
        : chuoiAnhMoi;
    }

    const ghiChuCapNhat = dto.ghiChu ?? existingHopDong.ghiChu;

    const updatedHopDong = await this.prisma.$transaction(async (prisma) => {
      const hopDong = await prisma.hopDong.update({
        where: { hopDongId: id },
        data: {
          ngayHetHan: ngayHetHanMoi,
          ghiChu: ghiChuCapNhat,
          anhHopDong: chuoiAnhUpdated,
        },
        include: {
          phong: {
            select: { tenPhong: true },
          },
          nguoiDaiDien: { select: { hoTen: true } },
          nguoiOGhep: { where: { isDelete: false } },
        },
      });
      await this.thongKeSnapshotService.invalidateAll(prisma);
      return hopDong;
    });

    return {
      success: true,
      message: 'Gia hạn hợp đồng thành công!',
      data: {
        ...updatedHopDong,
        anhHopDong: updatedHopDong.anhHopDong ? updatedHopDong.anhHopDong.split(',') : [],
      },
    };
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.$transaction(async (prisma) => {
      const hopDong = await prisma.hopDong.update({
        where: { hopDongId: id },
        data: { isDelete: true },
      });
      await this.thongKeSnapshotService.invalidateAll(prisma);
      return hopDong;
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.hopDong.findFirst({
      where: { hopDongId: id, isDelete: false },
    });
    if (!item) throw new NotFoundException(`HopDong với id ${id} không tồn tại`);
    return item;
  }

  async cancelContract(id: string) {
    const existingHopDong = await this.findOne(id);
    // Chỉ cho phép hủy khi hợp đồng đang ở trạng thái chờ hiệu lực (0)
    if (existingHopDong.trangThai !== 0) {
      throw new BadRequestException(
        'Chỉ có thể hủy các hợp đồng đang ở trạng thái chờ hiệu lực!',
      );
    }

    const { phongId, idntDaiDien } = existingHopDong;

    //KIỂM TRA CÔNG NỢ TẠP HÓA CỦA NGƯỜI ĐẠI DIỆN   
    const hoaDonTapHoaList = await this.prisma.hoaDonTapHoa.findMany({
      where: {
        idnt: idntDaiDien,
        isDelete: false,
      },
      include: {
        phieuThuHdTh: {
          where: { isDelete: false },
        },
      },
    });
    const coNoTapHoa = hoaDonTapHoaList.some((hd) => {
      const tongTien = Number(hd.tongTien ?? 0);
      const daThu = hd.phieuThuHdTh.reduce(
        (sum, pt) => sum + Number(pt.soTien ?? 0),
        0,
      );
      const conNo = Math.max(tongTien - daThu, 0);
      return conNo > 0;
    });

    if (coNoTapHoa) {
      throw new BadRequestException(
        'Người đại diện vẫn còn nợ hóa đơn tạp hóa chưa thanh toán. Vui lòng thanh toán hết trước khi hủy hợp đồng!',
      );
    }

    return await this.prisma.$transaction(async (prisma) => {
      //Xóa mềm hóa đơn hợp đồng đó nếu mà chủ trọ có lỡ tạo hóa đơn cho phòng chưa hiệu lực
      await prisma.hoaDonPhong.updateMany({
        where: {
          hopDongId: id,
          isDelete: false,
        },
        data: {
          isDelete: true,
        },
      });
      //Cập nhật hợp đồng thành đã xóa mềm (isDelete = true)
      const hopDongBiHuy = await prisma.hopDong.update({
        where: { hopDongId: id },
        data: { isDelete: true },
      });

      //ktra Xem phòng này còn bất kỳ hợp đồng nào khác không
      const conHopDongKhacCuaPhong = await prisma.hopDong.findFirst({
        where: {
          phongId: phongId,
          hopDongId: { not: id }, // Loại trừ hợp đồng đang hủy
          isDelete: false,
          trangThai: { in: [0, 1] }, // Vẫn còn hợp đồng 0 hoặc 1
        },
      });

      // Nếu hoàn toàn không còn hợp đồng nào khác dính tới phòng này -> reset trạng thái phòng về 0 (Trống)
      if (!conHopDongKhacCuaPhong) {
        await prisma.phong.update({
          where: { phongId: phongId },
          data: { trangThai: 0 },
        });
      }

      // Người ở ghép của hợp đồng này giữ nguyên (không đổi isDelete) để còn lịch sử ai từng ở đây.
      // Nếu người đại diện không còn hợp đồng nào khác đang hoạt động/chờ hiệu lực -> reset trạng thái
      const conHopDongKhacCuaDaiDien = await prisma.hopDong.findFirst({
        where: {
          idntDaiDien,
          hopDongId: { not: id },
          isDelete: false,
          trangThai: { in: [0, 1] },
        },
      });

      if (!conHopDongKhacCuaDaiDien) {
        await prisma.nguoiThue.update({
          where: { idnt: idntDaiDien },
          data: { trangThai: 0 },
        });
      }

      return {
        success: true,
        message: 'Hủy hợp đồng chờ hiệu lực thành công và đã cập nhật lại trạng thái phòng/người đại diện!',
        data: hopDongBiHuy,
      };
    });
  }

  //Kết thúc hợp đồng
  async terminateContract(id: string) {
    const existingHopDong = await this.findOne(id);

    // Chỉ cho phép kết thúc khi hợp đồng đang ở trạng thái hoạt động (1)
    if (existingHopDong.trangThai !== 1) {
      throw new BadRequestException(
        'Chỉ có thể kết thúc các hợp đồng đang ở trạng thái hoạt động!',
      );
    }

    const { phongId, idntDaiDien } = existingHopDong;

    //KIỂM TRA NỢ HÓA ĐƠN PHÒNG
    const hoaDonPhongChuaTra = await this.prisma.hoaDonPhong.findFirst({
      where: {
        hopDongId: id, // Kiểm tra theo hợp đồng này
        trangThai: { not: 2 }, // 2 là Đã thanh toán
        isDelete: false,
      },
    });

    if (hoaDonPhongChuaTra) {
      throw new BadRequestException(
        'Hợp đồng này vẫn còn hóa đơn tiền phòng chưa thanh toán xong. Không thể kết thúc!',
      );
    }

    //KIỂM TRA NỢ HÓA ĐƠN TẠP HÓA CỦA NGƯỜI ĐẠI DIỆN 
    const hoaDonTapHoaList = await this.prisma.hoaDonTapHoa.findMany({
      where: {
        idnt: idntDaiDien,
        isDelete: false,
      },
      include: {
        phieuThuHdTh: {
          where: { isDelete: false },
        },
      },
    });

    // Tính toán công nợ tạp hóa (conNo > 0)
    const coNoTapHoa = hoaDonTapHoaList.some((hd) => {
      const tongTien = Number(hd.tongTien ?? 0);
      const daThu = hd.phieuThuHdTh.reduce(
        (sum, pt) => sum + Number(pt.soTien ?? 0),
        0,
      );
      const conNo = Math.max(tongTien - daThu, 0);
      return conNo > 0;
    });

    if (coNoTapHoa) {
      throw new BadRequestException(
        'Người đại diện vẫn còn công nợ hóa đơn tạp hóa chưa thanh toán. Vui lòng thanh toán hết trước khi kết thúc hợp đồng!',
      );
    }

    //ktra xem phòng này còn hợp đồng nào khác đang hiệu lực thật sự không (không tính hợp đồng chờ hiệu lực,
    // vì người đó chưa dọn vào thì không có lý do gánh nợ điện nước phát sinh trước đó), nếu không còn thì
    // phải kiểm tra công nợ điện nước trước khi kết thúc hợp đồng
    const conHopDongKhacCuaPhongTruocKhiKetThuc = await this.prisma.hopDong.findFirst({
      where: {
        phongId,
        hopDongId: { not: id },
        isDelete: false,
        trangThai: 1,
      },
    });

    if (!conHopDongKhacCuaPhongTruocKhiKetThuc) {
      const danhSachChuaThanhToan = await this.hoaDonDienNuoc.layDanhSachChuaThanhToan(phongId);
      const coNoDienNuoc = danhSachChuaThanhToan.length > 0;

      if (coNoDienNuoc) {
        throw new BadRequestException(
          'Phòng vẫn còn hóa đơn điện nước chưa thanh toán xong. Vui lòng thanh toán hết trước khi kết thúc hợp đồng!',
        );
      }
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const homNay = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    return await this.prisma.$transaction(async (prisma) => {
      //Cập nhật hợp đồng: Chuyển trạng thái thành 2 (Đã kết thúc) và chốt ngày hết hạn là ngày hiện tại
      const updatedHopDong = await prisma.hopDong.update({
        where: { hopDongId: id },
        data: {
          trangThai: 2,
          ngayHetHan: homNay, // Chốt đúng ngày thực tế trả phòng
        },
      });

      //KIỂM TRA PHÒNG: Xem phòng này còn hợp đồng nào khác [0, 1] không
      const conHopDongKhacCuaPhong = await prisma.hopDong.findFirst({
        where: {
          phongId: phongId,
          hopDongId: { not: id },
          isDelete: false,
          trangThai: { in: [0, 1] },
        },
      });

      // Nếu không còn -> Trả phòng về trống (trangThai = 0)
      if (!conHopDongKhacCuaPhong) {
        await prisma.phong.update({
          where: { phongId: phongId },
          data: { trangThai: 0 },
        });
      }

      // Nếu người đại diện không còn hợp đồng nào khác đang hoạt động/chờ hiệu lực -> reset trạng thái
      const conHopDongKhacCuaDaiDien = await prisma.hopDong.findFirst({
        where: {
          idntDaiDien,
          hopDongId: { not: id },
          isDelete: false,
          trangThai: { in: [0, 1] },
        },
      });

      if (!conHopDongKhacCuaDaiDien) {
        await prisma.nguoiThue.update({
          where: { idnt: idntDaiDien },
          data: { trangThai: 0 },
        });
      }

      return {
        success: true,
        message: 'Kết thúc hợp đồng thành công, đã chốt ngày thực tế, kiểm tra sạch sẽ công nợ và giải phóng phòng!',
        data: updatedHopDong,
      };
    });
  }

  @Cron('0 0 * * *')
  async handleKichHoatContract() {
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);
    try {
      const dsHopDongChuahieuluc = await this.prisma.hopDong.findMany({
        where: {
          trangThai: 0,
          isDelete: false,
          ngayKy: {
            lte: homNay,
          },
        },
      });

      if (dsHopDongChuahieuluc.length === 0) return;
      for (const hd of dsHopDongChuahieuluc) {
        await this.prisma.$transaction(async (prisma) => {
          // Chuyển trạng thái hợp đồng thành 1
          await prisma.hopDong.update({
            where: { hopDongId: hd.hopDongId },
            data: { trangThai: 1 },
          });
        });
      }
      console.log('Kích hoạt hợp đồng tự động thành công!');
    } catch (e) {
      console.error('Lỗi khi chạy cron job kích hoạt hợp đồng:', e);
    }
  }

  private tinhTuoi(ngaySinh: Date, mocTinhTuoi: Date): number {
    let tuoi = mocTinhTuoi.getUTCFullYear() - ngaySinh.getUTCFullYear();
    const chuaDenSinhNhat =
      mocTinhTuoi.getUTCMonth() < ngaySinh.getUTCMonth() ||
      (mocTinhTuoi.getUTCMonth() === ngaySinh.getUTCMonth() &&
        mocTinhTuoi.getUTCDate() < ngaySinh.getUTCDate());

    return chuaDenSinhNhat ? tuoi - 1 : tuoi;
  }

  private parseNgayTheoLich(value?: string | Date | null): Date {
    if (!value) {
      const now = new Date();
      return new Date(Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      ));
    }

    if (value instanceof Date) {
      return new Date(Date.UTC(
        value.getUTCFullYear(),
        value.getUTCMonth(),
        value.getUTCDate(),
      ));
    }

    const ngay = value.split('T')[0].split(' ')[0];
    const parts = ngay.split('-').map(Number);
    if (
      parts.length !== 3 ||
      !parts.every((part) => Number.isInteger(part))
    ) {
      throw new BadRequestException('Ngày hợp đồng không hợp lệ.');
    }

    const [year, month, day] = parts;
    const result = new Date(Date.UTC(year, month - 1, day));
    if (
      result.getUTCFullYear() !== year ||
      result.getUTCMonth() !== month - 1 ||
      result.getUTCDate() !== day
    ) {
      throw new BadRequestException('Ngày hợp đồng không hợp lệ.');
    }

    return result;
  }

  private ngayHomNayTheoLich(): Date {
    return this.parseNgayTheoLich();
  }

  // Chuẩn hóa danh sách người ở ghép: chấp nhận JSON string (do FE gửi qua multipart/form-data) hoặc mảng object sẵn.
  // Mỗi phần tử bắt buộc phải có CCCD - đây là khóa chính, xác định danh tính người ở ghép.
  private chuanHoaDanhSachNguoiOGhep(danhSachInput: unknown) {
    let danhSach: unknown = danhSachInput;

    if (danhSach === undefined || danhSach === null || danhSach === '') {
      return [];
    }

    if (typeof danhSach === 'string') {
      try {
        danhSach = JSON.parse(danhSach);
      } catch {
        throw new BadRequestException('Danh sách người ở ghép không đúng định dạng JSON.');
      }
    }

    if (!Array.isArray(danhSach)) {
      throw new BadRequestException('Danh sách người ở ghép phải là một mảng.');
    }

    return danhSach.map((item: any) => {
      if (!item || typeof item !== 'object') {
        throw new BadRequestException('Một người ở ghép trong danh sách không hợp lệ.');
      }

      const cccd = String(item.cccd ?? item.CCCD ?? '').trim();
      if (!cccd) {
        throw new BadRequestException('Người ở ghép phải có CCCD.');
      }

      return {
        cccd,
        hoTen: item.hoTen ? String(item.hoTen).trim() : null,
        sdt: item.sdt ?? item.SDT ? String(item.sdt ?? item.SDT).trim() : null,
        quanHeVoiDaiDien: item.quanHeVoiDaiDien ? String(item.quanHeVoiDaiDien).trim() : null,
      };
    });
  }

  //--------------------------------------------------------------------------------
  async search(req: SearchHopDongDto) {
    const { ma, limit = 10, offset = 0, sortBy = 'hopDongId', sort = 'desc' } = req;
    const where: any = { isDelete: false };

    if (ma) {
      where.hopDongId = { contains: ma };
    }

    const [data, total] = await Promise.all([
      this.prisma.hopDong.findMany({
        where,
        orderBy: { [sortBy]: sort },
        take: Number(limit),
        skip: Number(offset),
      }),
      this.prisma.hopDong.count({ where }),
    ]);

    return { total, data };
  }

  getAllLoadingBalance(id?: string) {
    return this.prisma.hopDong.findMany({
      where: { isDelete: false },
      orderBy: { hopDongId: 'asc' },
      take: 15,
      ...(id !== undefined && id !== null
        ? { skip: 1, cursor: { hopDongId: id } }
        : {}),
    });
  }

  async getHopDongByPhong(phongId: number) {
    const phong = await this.prisma.phong.findFirst({
      where: { phongId, isDelete: false },
    });

    if (!phong) {
      throw new NotFoundException(`Phòng với ID ${phongId} không tồn tại`);
    }

    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0); // bỏ giờ/phút/giây để so sánh theo ngày

    const list = await this.prisma.hopDong.findMany({
      where: {
        phongId,
        isDelete: false,
        ngayHetHan: { gt: homNay },
      },
      include: {
        nguoiDaiDien: true,
        nguoiOGhep: { where: { isDelete: false } },
      },
      orderBy: { ngayKy: 'desc' },
    });

    return list;
  }
}
