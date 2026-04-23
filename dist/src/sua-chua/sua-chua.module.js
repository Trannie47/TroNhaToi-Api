"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuaChuaModule = void 0;
const common_1 = require("@nestjs/common");
const sua_chua_service_1 = require("./services/sua-chua.service");
const sua_chua_controller_1 = require("./controllers/sua-chua.controller");
let SuaChuaModule = class SuaChuaModule {
};
exports.SuaChuaModule = SuaChuaModule;
exports.SuaChuaModule = SuaChuaModule = __decorate([
    (0, common_1.Module)({
        controllers: [sua_chua_controller_1.SuaChuaController],
        providers: [sua_chua_service_1.SuaChuaService],
        exports: [sua_chua_service_1.SuaChuaService],
    })
], SuaChuaModule);
//# sourceMappingURL=sua-chua.module.js.map