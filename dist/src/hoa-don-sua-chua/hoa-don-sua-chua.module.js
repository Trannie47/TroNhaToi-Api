"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoaDonSuaChuaModule = void 0;
const common_1 = require("@nestjs/common");
const hoa_don_sua_chua_service_1 = require("./services/hoa-don-sua-chua.service");
const hoa_don_sua_chua_controller_1 = require("./controllers/hoa-don-sua-chua.controller");
let HoaDonSuaChuaModule = class HoaDonSuaChuaModule {
};
exports.HoaDonSuaChuaModule = HoaDonSuaChuaModule;
exports.HoaDonSuaChuaModule = HoaDonSuaChuaModule = __decorate([
    (0, common_1.Module)({
        controllers: [hoa_don_sua_chua_controller_1.HoaDonSuaChuaController],
        providers: [hoa_don_sua_chua_service_1.HoaDonSuaChuaService],
        exports: [hoa_don_sua_chua_service_1.HoaDonSuaChuaService],
    })
], HoaDonSuaChuaModule);
//# sourceMappingURL=hoa-don-sua-chua.module.js.map