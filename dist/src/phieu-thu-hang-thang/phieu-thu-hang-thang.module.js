"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhieuThuHangThangModule = void 0;
const common_1 = require("@nestjs/common");
const phieu_thu_hang_thang_service_1 = require("./services/phieu-thu-hang-thang.service");
const phieu_thu_hang_thang_controller_1 = require("./controllers/phieu-thu-hang-thang.controller");
let PhieuThuHangThangModule = class PhieuThuHangThangModule {
};
exports.PhieuThuHangThangModule = PhieuThuHangThangModule;
exports.PhieuThuHangThangModule = PhieuThuHangThangModule = __decorate([
    (0, common_1.Module)({
        controllers: [phieu_thu_hang_thang_controller_1.PhieuThuHangThangController],
        providers: [phieu_thu_hang_thang_service_1.PhieuThuHangThangService],
        exports: [phieu_thu_hang_thang_service_1.PhieuThuHangThangService],
    })
], PhieuThuHangThangModule);
//# sourceMappingURL=phieu-thu-hang-thang.module.js.map