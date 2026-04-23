"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoaDonTapHoaModule = void 0;
const common_1 = require("@nestjs/common");
const hoa_don_tap_hoa_service_1 = require("./services/hoa-don-tap-hoa.service");
const hoa_don_tap_hoa_controller_1 = require("./controllers/hoa-don-tap-hoa.controller");
let HoaDonTapHoaModule = class HoaDonTapHoaModule {
};
exports.HoaDonTapHoaModule = HoaDonTapHoaModule;
exports.HoaDonTapHoaModule = HoaDonTapHoaModule = __decorate([
    (0, common_1.Module)({
        controllers: [hoa_don_tap_hoa_controller_1.HoaDonTapHoaController],
        providers: [hoa_don_tap_hoa_service_1.HoaDonTapHoaService],
        exports: [hoa_don_tap_hoa_service_1.HoaDonTapHoaService],
    })
], HoaDonTapHoaModule);
//# sourceMappingURL=hoa-don-tap-hoa.module.js.map