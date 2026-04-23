"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LapRapModule = void 0;
const common_1 = require("@nestjs/common");
const lap_rap_service_1 = require("./services/lap-rap.service");
const lap_rap_controller_1 = require("./controllers/lap-rap.controller");
let LapRapModule = class LapRapModule {
};
exports.LapRapModule = LapRapModule;
exports.LapRapModule = LapRapModule = __decorate([
    (0, common_1.Module)({
        controllers: [lap_rap_controller_1.LapRapController],
        providers: [lap_rap_service_1.LapRapService],
        exports: [lap_rap_service_1.LapRapService],
    })
], LapRapModule);
//# sourceMappingURL=lap-rap.module.js.map