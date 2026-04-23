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
exports.NguoiLuuTruTamThoiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nguoi_luu_tru_tam_thoi_service_1 = require("../services/nguoi-luu-tru-tam-thoi.service");
const create_nguoi_luu_tru_tam_thoi_dto_1 = require("../dto/create-nguoi-luu-tru-tam-thoi.dto");
const update_nguoi_luu_tru_tam_thoi_dto_1 = require("../dto/update-nguoi-luu-tru-tam-thoi.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let NguoiLuuTruTamThoiController = class NguoiLuuTruTamThoiController {
    constructor(nguoiLuuTruTamThoiService) {
        this.nguoiLuuTruTamThoiService = nguoiLuuTruTamThoiService;
    }
    create(dto) {
        return this.nguoiLuuTruTamThoiService.create(dto);
    }
    findAll() {
        return this.nguoiLuuTruTamThoiService.findAll();
    }
    findOne(id) {
        return this.nguoiLuuTruTamThoiService.findOne(id);
    }
    update(id, dto) {
        return this.nguoiLuuTruTamThoiService.update(id, dto);
    }
    remove(id) {
        return this.nguoiLuuTruTamThoiService.remove(id);
    }
};
exports.NguoiLuuTruTamThoiController = NguoiLuuTruTamThoiController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Người Lưu Trú Tạm Thời mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nguoi_luu_tru_tam_thoi_dto_1.CreateNguoiLuuTruTamThoiDto]),
    __metadata("design:returntype", void 0)
], NguoiLuuTruTamThoiController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Người Lưu Trú Tạm Thời' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NguoiLuuTruTamThoiController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':idtt'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Người Lưu Trú Tạm Thời' }),
    (0, swagger_1.ApiParam)({ name: 'idtt', description: 'ID của Người Lưu Trú Tạm Thời' }),
    __param(0, (0, common_1.Param)('idtt', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NguoiLuuTruTamThoiController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':idtt'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Người Lưu Trú Tạm Thời' }),
    __param(0, (0, common_1.Param)('idtt', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_nguoi_luu_tru_tam_thoi_dto_1.UpdateNguoiLuuTruTamThoiDto]),
    __metadata("design:returntype", void 0)
], NguoiLuuTruTamThoiController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':idtt'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Người Lưu Trú Tạm Thời' }),
    __param(0, (0, common_1.Param)('idtt', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NguoiLuuTruTamThoiController.prototype, "remove", null);
exports.NguoiLuuTruTamThoiController = NguoiLuuTruTamThoiController = __decorate([
    (0, swagger_1.ApiTags)('Người Lưu Trú Tạm Thời'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('nguoi-luu-tru-tam-thoi'),
    __metadata("design:paramtypes", [nguoi_luu_tru_tam_thoi_service_1.NguoiLuuTruTamThoiService])
], NguoiLuuTruTamThoiController);
//# sourceMappingURL=nguoi-luu-tru-tam-thoi.controller.js.map