"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LapRapController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lap_rap_service_1 = require("../services/lap-rap.service");
const create_lap_rap_dto_1 = require("../dto/create-lap-rap.dto");
const update_lap_rap_dto_1 = require("../dto/update-lap-rap.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let LapRapController = class LapRapController {
    constructor(lapRapService) {
        this.lapRapService = lapRapService;
    }
    create(dto) {
        return this.lapRapService.create(dto);
    }
    findAll() {
        return this.lapRapService.findAll();
    }
    findOne(id) {
        return this.lapRapService.findOne(id);
    }
    update(id, dto) {
        return this.lapRapService.update(id, dto);
    }
    remove(id) {
        return this.lapRapService.remove(id);
    }
};
exports.LapRapController = LapRapController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Lắp Ráp Thiết Bị mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lap_rap_dto_1.CreateLapRapDto]),
    __metadata("design:returntype", void 0)
], LapRapController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Lắp Ráp Thiết Bị' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LapRapController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Lắp Ráp Thiết Bị' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của Lắp Ráp Thiết Bị' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LapRapController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Lắp Ráp Thiết Bị' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lap_rap_dto_1.UpdateLapRapDto]),
    __metadata("design:returntype", void 0)
], LapRapController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Lắp Ráp Thiết Bị' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LapRapController.prototype, "remove", null);
exports.LapRapController = LapRapController = __decorate([
    (0, swagger_1.ApiTags)('Lắp Ráp Thiết Bị'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lap-rap'),
    __metadata("design:paramtypes", [lap_rap_service_1.LapRapService])
], LapRapController);
//# sourceMappingURL=lap-rap.controller.js.map