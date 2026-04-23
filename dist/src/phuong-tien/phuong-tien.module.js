"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhuongTienModule = void 0;
const common_1 = require("@nestjs/common");
const phuong_tien_service_1 = require("./services/phuong-tien.service");
const phuong_tien_controller_1 = require("./controllers/phuong-tien.controller");
let PhuongTienModule = class PhuongTienModule {
};
exports.PhuongTienModule = PhuongTienModule;
exports.PhuongTienModule = PhuongTienModule = __decorate([
    (0, common_1.Module)({
        controllers: [phuong_tien_controller_1.PhuongTienController],
        providers: [phuong_tien_service_1.PhuongTienService],
        exports: [phuong_tien_service_1.PhuongTienService],
    })
], PhuongTienModule);
//# sourceMappingURL=phuong-tien.module.js.map