"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoaDonGuiXeModule = void 0;
const common_1 = require("@nestjs/common");
const hoa_don_gui_xe_service_1 = require("./services/hoa-don-gui-xe.service");
const hoa_don_gui_xe_controller_1 = require("./controllers/hoa-don-gui-xe.controller");
let HoaDonGuiXeModule = class HoaDonGuiXeModule {
};
exports.HoaDonGuiXeModule = HoaDonGuiXeModule;
exports.HoaDonGuiXeModule = HoaDonGuiXeModule = __decorate([
    (0, common_1.Module)({
        controllers: [hoa_don_gui_xe_controller_1.HoaDonGuiXeController],
        providers: [hoa_don_gui_xe_service_1.HoaDonGuiXeService],
        exports: [hoa_don_gui_xe_service_1.HoaDonGuiXeService],
    })
], HoaDonGuiXeModule);
//# sourceMappingURL=hoa-don-gui-xe.module.js.map