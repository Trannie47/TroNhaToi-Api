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
exports.HopDongController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hop_dong_service_1 = require("../services/hop-dong.service");
const create_hop_dong_dto_1 = require("../dto/create-hop-dong.dto");
const update_hop_dong_dto_1 = require("../dto/update-hop-dong.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let HopDongController = class HopDongController {
    constructor(hopDongService) {
        this.hopDongService = hopDongService;
    }
    create(dto) {
        return this.hopDongService.create(dto);
    }
    findAll() {
        return this.hopDongService.findAll();
    }
    findOne(id) {
        return this.hopDongService.findOne(id);
    }
    update(id, dto) {
        return this.hopDongService.update(id, dto);
    }
    remove(id) {
        return this.hopDongService.remove(id);
    }
};
exports.HopDongController = HopDongController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Hợp Đồng mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hop_dong_dto_1.CreateHopDongDto]),
    __metadata("design:returntype", void 0)
], HopDongController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Hợp Đồng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HopDongController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':hopDongId'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Hợp Đồng' }),
    (0, swagger_1.ApiParam)({ name: 'hopDongId', description: 'ID của Hợp Đồng' }),
    __param(0, (0, common_1.Param)('hopDongId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HopDongController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':hopDongId'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Hợp Đồng' }),
    __param(0, (0, common_1.Param)('hopDongId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hop_dong_dto_1.UpdateHopDongDto]),
    __metadata("design:returntype", void 0)
], HopDongController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':hopDongId'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Hợp Đồng' }),
    __param(0, (0, common_1.Param)('hopDongId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HopDongController.prototype, "remove", null);
exports.HopDongController = HopDongController = __decorate([
    (0, swagger_1.ApiTags)('Hợp Đồng'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hop-dong'),
    __metadata("design:paramtypes", [hop_dong_service_1.HopDongService])
], HopDongController);
//# sourceMappingURL=hop-dong.controller.js.map