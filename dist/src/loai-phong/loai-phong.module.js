"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaiPhongModule = void 0;
const common_1 = require("@nestjs/common");
const loai_phong_service_1 = require("./services/loai-phong.service");
const loai_phong_controller_1 = require("./controllers/loai-phong.controller");
let LoaiPhongModule = class LoaiPhongModule {
};
exports.LoaiPhongModule = LoaiPhongModule;
exports.LoaiPhongModule = LoaiPhongModule = __decorate([
    (0, common_1.Module)({
        controllers: [loai_phong_controller_1.LoaiPhongController],
        providers: [loai_phong_service_1.LoaiPhongService],
        exports: [loai_phong_service_1.LoaiPhongService],
    })
], LoaiPhongModule);
//# sourceMappingURL=loai-phong.module.js.map