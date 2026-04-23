"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChiTietTapHoaModule = void 0;
const common_1 = require("@nestjs/common");
const chi_tiet_tap_hoa_service_1 = require("./services/chi-tiet-tap-hoa.service");
const chi_tiet_tap_hoa_controller_1 = require("./controllers/chi-tiet-tap-hoa.controller");
let ChiTietTapHoaModule = class ChiTietTapHoaModule {
};
exports.ChiTietTapHoaModule = ChiTietTapHoaModule;
exports.ChiTietTapHoaModule = ChiTietTapHoaModule = __decorate([
    (0, common_1.Module)({
        controllers: [chi_tiet_tap_hoa_controller_1.ChiTietTapHoaController],
        providers: [chi_tiet_tap_hoa_service_1.ChiTietTapHoaService],
        exports: [chi_tiet_tap_hoa_service_1.ChiTietTapHoaService],
    })
], ChiTietTapHoaModule);
//# sourceMappingURL=chi-tiet-tap-hoa.module.js.map