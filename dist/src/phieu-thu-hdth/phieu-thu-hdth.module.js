"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhieuThuHdThModule = void 0;
const common_1 = require("@nestjs/common");
const phieu_thu_hdth_service_1 = require("./services/phieu-thu-hdth.service");
const phieu_thu_hdth_controller_1 = require("./controllers/phieu-thu-hdth.controller");
let PhieuThuHdThModule = class PhieuThuHdThModule {
};
exports.PhieuThuHdThModule = PhieuThuHdThModule;
exports.PhieuThuHdThModule = PhieuThuHdThModule = __decorate([
    (0, common_1.Module)({
        controllers: [phieu_thu_hdth_controller_1.PhieuThuHdThController],
        providers: [phieu_thu_hdth_service_1.PhieuThuHdThService],
        exports: [phieu_thu_hdth_service_1.PhieuThuHdThService],
    })
], PhieuThuHdThModule);
//# sourceMappingURL=phieu-thu-hdth.module.js.map