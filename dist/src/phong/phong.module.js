"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhongModule = void 0;
const common_1 = require("@nestjs/common");
const phong_service_1 = require("./services/phong.service");
const phong_controller_1 = require("./controllers/phong.controller");
let PhongModule = class PhongModule {
};
exports.PhongModule = PhongModule;
exports.PhongModule = PhongModule = __decorate([
    (0, common_1.Module)({
        controllers: [phong_controller_1.PhongController],
        providers: [phong_service_1.PhongService],
        exports: [phong_service_1.PhongService],
    })
], PhongModule);
//# sourceMappingURL=phong.module.js.map