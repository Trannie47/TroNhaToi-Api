"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const loai_phong_module_1 = require("./loai-phong/loai-phong.module");
const phong_module_1 = require("./phong/phong.module");
const nguoi_thue_module_1 = require("./nguoi-thue/nguoi-thue.module");
const hop_dong_module_1 = require("./hop-dong/hop-dong.module");
const dien_nuoc_module_1 = require("./dien-nuoc/dien-nuoc.module");
const hoa_don_phong_module_1 = require("./hoa-don-phong/hoa-don-phong.module");
const phieu_thu_hang_thang_module_1 = require("./phieu-thu-hang-thang/phieu-thu-hang-thang.module");
const phuong_tien_module_1 = require("./phuong-tien/phuong-tien.module");
const hoa_don_gui_xe_module_1 = require("./hoa-don-gui-xe/hoa-don-gui-xe.module");
const hang_hoa_module_1 = require("./hang-hoa/hang-hoa.module");
const hoa_don_tap_hoa_module_1 = require("./hoa-don-tap-hoa/hoa-don-tap-hoa.module");
const chi_tiet_tap_hoa_module_1 = require("./chi-tiet-tap-hoa/chi-tiet-tap-hoa.module");
const phieu_thu_hdth_module_1 = require("./phieu-thu-hdth/phieu-thu-hdth.module");
const thiet_bi_module_1 = require("./thiet-bi/thiet-bi.module");
const lap_rap_module_1 = require("./lap-rap/lap-rap.module");
const sua_chua_module_1 = require("./sua-chua/sua-chua.module");
const hoa_don_sua_chua_module_1 = require("./hoa-don-sua-chua/hoa-don-sua-chua.module");
const nguoi_luu_tru_tam_thoi_module_1 = require("./nguoi-luu-tru-tam-thoi/nguoi-luu-tru-tam-thoi.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            loai_phong_module_1.LoaiPhongModule,
            phong_module_1.PhongModule,
            nguoi_thue_module_1.NguoiThueModule,
            hop_dong_module_1.HopDongModule,
            dien_nuoc_module_1.DienNuocModule,
            hoa_don_phong_module_1.HoaDonPhongModule,
            phieu_thu_hang_thang_module_1.PhieuThuHangThangModule,
            phuong_tien_module_1.PhuongTienModule,
            hoa_don_gui_xe_module_1.HoaDonGuiXeModule,
            hang_hoa_module_1.HangHoaModule,
            hoa_don_tap_hoa_module_1.HoaDonTapHoaModule,
            chi_tiet_tap_hoa_module_1.ChiTietTapHoaModule,
            phieu_thu_hdth_module_1.PhieuThuHdThModule,
            thiet_bi_module_1.ThietBiModule,
            lap_rap_module_1.LapRapModule,
            sua_chua_module_1.SuaChuaModule,
            hoa_don_sua_chua_module_1.HoaDonSuaChuaModule,
            nguoi_luu_tru_tam_thoi_module_1.NguoiLuuTruTamThoiModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map