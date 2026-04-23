"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThietBiModule = void 0;
const common_1 = require("@nestjs/common");
const thiet_bi_service_1 = require("./services/thiet-bi.service");
const thiet_bi_controller_1 = require("./controllers/thiet-bi.controller");
let ThietBiModule = class ThietBiModule {
};
exports.ThietBiModule = ThietBiModule;
exports.ThietBiModule = ThietBiModule = __decorate([
    (0, common_1.Module)({
        controllers: [thiet_bi_controller_1.ThietBiController],
        providers: [thiet_bi_service_1.ThietBiService],
        exports: [thiet_bi_service_1.ThietBiService],
    })
], ThietBiModule);
//# sourceMappingURL=thiet-bi.module.js.map