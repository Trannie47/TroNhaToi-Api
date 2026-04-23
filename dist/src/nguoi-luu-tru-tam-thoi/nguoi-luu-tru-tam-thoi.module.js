"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NguoiLuuTruTamThoiModule = void 0;
const common_1 = require("@nestjs/common");
const nguoi_luu_tru_tam_thoi_service_1 = require("./services/nguoi-luu-tru-tam-thoi.service");
const nguoi_luu_tru_tam_thoi_controller_1 = require("./controllers/nguoi-luu-tru-tam-thoi.controller");
let NguoiLuuTruTamThoiModule = class NguoiLuuTruTamThoiModule {
};
exports.NguoiLuuTruTamThoiModule = NguoiLuuTruTamThoiModule;
exports.NguoiLuuTruTamThoiModule = NguoiLuuTruTamThoiModule = __decorate([
    (0, common_1.Module)({
        controllers: [nguoi_luu_tru_tam_thoi_controller_1.NguoiLuuTruTamThoiController],
        providers: [nguoi_luu_tru_tam_thoi_service_1.NguoiLuuTruTamThoiService],
        exports: [nguoi_luu_tru_tam_thoi_service_1.NguoiLuuTruTamThoiService],
    })
], NguoiLuuTruTamThoiModule);
//# sourceMappingURL=nguoi-luu-tru-tam-thoi.module.js.map