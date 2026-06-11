-- CreateTable
CREATE TABLE `loaiphong` (
    `maLoaiPhong` INTEGER NOT NULL AUTO_INCREMENT,
    `tenLoaiPhong` VARCHAR(255) NOT NULL,
    `dienTich` FLOAT NULL,
    `isMayLanh` BOOLEAN NULL,
    `soNguoiToiDa` INTEGER NULL,
    `giaTien` DECIMAL(10, 2) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`maLoaiPhong`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phong` (
    `PhongID` INTEGER NOT NULL AUTO_INCREMENT,
    `tenPhong` VARCHAR(255) NULL,
    `trangThai` VARCHAR(100) NULL,
    `moTa` TEXT NULL,
    `maLoaiPhong` INTEGER NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `maLoaiPhong`(`maLoaiPhong`),
    PRIMARY KEY (`PhongID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguoithue` (
    `IDNT` INTEGER NOT NULL AUTO_INCREMENT,
    `CCCD` VARCHAR(50) NULL,
    `hoTen` VARCHAR(255) NULL,
    `ngaySinh` DATE NULL,
    `SDT` VARCHAR(20) NULL,
    `queQuan` VARCHAR(255) NULL,
    `ghiChu` TEXT NULL,
    `gioiTinh` BOOLEAN NOT NULL DEFAULT true,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`IDNT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hopdong` (
    `HopDongID` CHAR(11) NOT NULL,
    `IDNT` INTEGER NOT NULL,
    `PhongID` INTEGER NULL,
    `ngayKy` DATE NULL,
    `ngayHetHan` DATE NULL,
    `tienCoc` DECIMAL(10, 2) NULL,
    `giaPhongThucTe` DECIMAL(10, 2) NULL,
    `trangThai` INTEGER NULL DEFAULT 0,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `IDNT`(`IDNT`),
    INDEX `PhongID`(`PhongID`),
    PRIMARY KEY (`HopDongID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diennuoc` (
    `idDienNuoc` CHAR(12) NOT NULL,
    `PhongID` INTEGER NULL,
    `thangNam` VARCHAR(20) NULL,
    `chiSoDien` INTEGER NULL,
    `chiSoNuoc` INTEGER NULL,
    `TrangThai` INTEGER NOT NULL DEFAULT 0,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `PhongID`(`PhongID`),
    PRIMARY KEY (`idDienNuoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoadonphong` (
    `maHoaDon` CHAR(23) NOT NULL,
    `thangNam` VARCHAR(20) NULL,
    `soTien` DECIMAL(10, 2) NULL,
    `HopDongID` CHAR(11) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `HoaDonPhong_HopDong`(`HopDongID`),
    PRIMARY KEY (`maHoaDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phieuthuhangthang` (
    `maPhieuThu` INTEGER NOT NULL AUTO_INCREMENT,
    `ngayThu` DATE NULL,
    `soTien` DECIMAL(10, 2) NULL,
    `ghiChu` TEXT NULL,
    `maHoaDon` CHAR(23) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `phieuthuhangthang_ibfk_1`(`maHoaDon`),
    PRIMARY KEY (`maPhieuThu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phuongtien` (
    `ID` INTEGER NOT NULL,
    `bienSo` VARCHAR(50) NOT NULL,
    `hangXe` VARCHAR(100) NULL,
    `mauSac` VARCHAR(100) NULL,
    `IDNT` INTEGER NULL,
    `loaixe` INTEGER NOT NULL DEFAULT 0,
    `SoTien` DOUBLE NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `IDNT`(`IDNT`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoadonguixe` (
    `maHoaDon` INTEGER NOT NULL AUTO_INCREMENT,
    `thangNam` VARCHAR(20) NULL,
    `soTien` DECIMAL(10, 2) NULL,
    `TrangThai` INTEGER NOT NULL DEFAULT 0,
    `idPT` INTEGER NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `hoadonGuiXe_PhuongTien_Fk`(`idPT`),
    PRIMARY KEY (`maHoaDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hanghoa` (
    `maHangHoa` INTEGER NOT NULL AUTO_INCREMENT,
    `tenHangHoa` VARCHAR(255) NULL,
    `giaNhap` DECIMAL(10, 2) NULL,
    `giaBan` DECIMAL(10, 2) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`maHangHoa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoadontaphoa` (
    `maHoaDon` CHAR(11) NOT NULL,
    `IDNT` INTEGER NULL,
    `ngayBan` DATE NULL,
    `tongTien` DECIMAL(10, 2) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `IDNT`(`IDNT`),
    PRIMARY KEY (`maHoaDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chitiettaphoa` (
    `maChiTietHoaDon` INTEGER NOT NULL AUTO_INCREMENT,
    `maHoaDon` CHAR(11) NULL,
    `maHangHoa` INTEGER NULL,
    `soLuong` INTEGER NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `chitiettaphoa_ibfk_1`(`maHoaDon`),
    INDEX `maHangHoa`(`maHangHoa`),
    PRIMARY KEY (`maChiTietHoaDon`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phieuthuhdth` (
    `maPhieuThu` INTEGER NOT NULL AUTO_INCREMENT,
    `ngayThu` DATE NULL,
    `soTien` DECIMAL(10, 2) NULL,
    `nguoiDong` VARCHAR(255) NULL,
    `maHoaDon` CHAR(11) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `phieuthuhdth_ibfk_1`(`maHoaDon`),
    PRIMARY KEY (`maPhieuThu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `thietbi` (
    `thietBiID` INTEGER NOT NULL AUTO_INCREMENT,
    `tenThietBi` VARCHAR(255) NULL,
    `loai` VARCHAR(100) NULL,
    `giaTri` DECIMAL(10, 2) NULL,
    `ngayMua` DATE NULL,
    `trangThai` VARCHAR(100) NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`thietBiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laprap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `PhongID` INTEGER NULL,
    `thietBiID` INTEGER NULL,
    `ngayLap` DATE NULL,
    `soLuong` INTEGER NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `PhongID`(`PhongID`),
    INDEX `thietBiID`(`thietBiID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suachua` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `PhongID` INTEGER NULL,
    `nguyenNhan` TEXT NULL,
    `ngaySuaChua` DATE NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `PhongID`(`PhongID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hoadonsuachua` (
    `maHoaDonSC` INTEGER NOT NULL AUTO_INCREMENT,
    `TrangThai` INTEGER NOT NULL DEFAULT 0,
    `giaTien` DECIMAL(10, 2) NULL,
    `loaiSua` VARCHAR(255) NULL,
    `ngayLapHoaDonSC` DATE NULL,
    `idSuaChua` INTEGER NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `id`(`idSuaChua`),
    PRIMARY KEY (`maHoaDonSC`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nguoiluutrutamthoi` (
    `IDTT` INTEGER NOT NULL AUTO_INCREMENT,
    `hoTen` VARCHAR(255) NULL,
    `CCCD` VARCHAR(50) NULL,
    `ngaySinh` DATE NULL,
    `SDT` VARCHAR(20) NULL,
    `queQuan` VARCHAR(255) NULL,
    `PhongID` INTEGER NULL,
    `IDNT` INTEGER NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `PhongID`(`PhongID`),
    INDEX `NguoiLuuTruTamThoi_Fk1`(`IDNT`),
    PRIMARY KEY (`IDTT`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `role` VARCHAR(50) NULL DEFAULT 'admin',
    `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `phong` ADD CONSTRAINT `phong_ibfk_1` FOREIGN KEY (`maLoaiPhong`) REFERENCES `loaiphong`(`maLoaiPhong`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hopdong` ADD CONSTRAINT `HopDong_Fk1` FOREIGN KEY (`IDNT`) REFERENCES `nguoithue`(`IDNT`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hopdong` ADD CONSTRAINT `HopDong_Fk2` FOREIGN KEY (`PhongID`) REFERENCES `phong`(`PhongID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `diennuoc` ADD CONSTRAINT `diennuoc_ibfk_1` FOREIGN KEY (`PhongID`) REFERENCES `phong`(`PhongID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hoadonphong` ADD CONSTRAINT `HoaDonPhong_HopDong` FOREIGN KEY (`HopDongID`) REFERENCES `hopdong`(`HopDongID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `phieuthuhangthang` ADD CONSTRAINT `phieuthuhangthang_ibfk_1` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadonphong`(`maHoaDon`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `phuongtien` ADD CONSTRAINT `PhuongTien_FK` FOREIGN KEY (`IDNT`) REFERENCES `nguoithue`(`IDNT`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hoadonguixe` ADD CONSTRAINT `hoadonGuiXe_PhuongTien_Fk` FOREIGN KEY (`idPT`) REFERENCES `phuongtien`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `hoadontaphoa` ADD CONSTRAINT `hoadontaphoa_ibfk_1` FOREIGN KEY (`IDNT`) REFERENCES `nguoithue`(`IDNT`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chitiettaphoa` ADD CONSTRAINT `chitiettaphoa_ibfk_1` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadontaphoa`(`maHoaDon`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chitiettaphoa` ADD CONSTRAINT `chitiettaphoa_ibfk_2` FOREIGN KEY (`maHangHoa`) REFERENCES `hanghoa`(`maHangHoa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `phieuthuhdth` ADD CONSTRAINT `phieuthuhdth_ibfk_1` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadontaphoa`(`maHoaDon`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `laprap` ADD CONSTRAINT `LapRap_FK1` FOREIGN KEY (`PhongID`) REFERENCES `phong`(`PhongID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `laprap` ADD CONSTRAINT `LapRap_FK2` FOREIGN KEY (`thietBiID`) REFERENCES `thietbi`(`thietBiID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `suachua` ADD CONSTRAINT `suaChua_FK` FOREIGN KEY (`PhongID`) REFERENCES `phong`(`PhongID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hoadonsuachua` ADD CONSTRAINT `hoadonsuachua_ibfk_1` FOREIGN KEY (`idSuaChua`) REFERENCES `suachua`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `nguoiluutrutamthoi` ADD CONSTRAINT `NguoiLuuTruTamThoi_FK2` FOREIGN KEY (`PhongID`) REFERENCES `phong`(`PhongID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `nguoiluutrutamthoi` ADD CONSTRAINT `NguoiLuuTruTamThoi_Fk1` FOREIGN KEY (`IDNT`) REFERENCES `nguoithue`(`IDNT`) ON DELETE RESTRICT ON UPDATE RESTRICT;
