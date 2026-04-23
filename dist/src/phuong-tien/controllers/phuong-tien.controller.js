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
exports.PhuongTienController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const phuong_tien_service_1 = require("../services/phuong-tien.service");
const create_phuong_tien_dto_1 = require("../dto/create-phuong-tien.dto");
const update_phuong_tien_dto_1 = require("../dto/update-phuong-tien.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PhuongTienController = class PhuongTienController {
    constructor(phuongTienService) {
        this.phuongTienService = phuongTienService;
    }
    create(dto) {
        return this.phuongTienService.create(dto);
    }
    findAll() {
        return this.phuongTienService.findAll();
    }
    findOne(id) {
        return this.phuongTienService.findOne(id);
    }
    update(id, dto) {
        return this.phuongTienService.update(id, dto);
    }
    remove(id) {
        return this.phuongTienService.remove(id);
    }
};
exports.PhuongTienController = PhuongTienController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Phương Tiện mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_phuong_tien_dto_1.CreatePhuongTienDto]),
    __metadata("design:returntype", void 0)
], PhuongTienController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Phương Tiện' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhuongTienController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':bienSo'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Phương Tiện' }),
    (0, swagger_1.ApiParam)({ name: 'bienSo', description: 'ID của Phương Tiện' }),
    __param(0, (0, common_1.Param)('bienSo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhuongTienController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':bienSo'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Phương Tiện' }),
    __param(0, (0, common_1.Param)('bienSo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_phuong_tien_dto_1.UpdatePhuongTienDto]),
    __metadata("design:returntype", void 0)
], PhuongTienController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':bienSo'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Phương Tiện' }),
    __param(0, (0, common_1.Param)('bienSo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PhuongTienController.prototype, "remove", null);
exports.PhuongTienController = PhuongTienController = __decorate([
    (0, swagger_1.ApiTags)('Phương Tiện'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('phuong-tien'),
    __metadata("design:paramtypes", [phuong_tien_service_1.PhuongTienService])
], PhuongTienController);
//# sourceMappingURL=phuong-tien.controller.js.map