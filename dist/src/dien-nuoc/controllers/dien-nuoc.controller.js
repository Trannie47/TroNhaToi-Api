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
exports.DienNuocController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dien_nuoc_service_1 = require("../services/dien-nuoc.service");
const create_dien_nuoc_dto_1 = require("../dto/create-dien-nuoc.dto");
const update_dien_nuoc_dto_1 = require("../dto/update-dien-nuoc.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let DienNuocController = class DienNuocController {
    constructor(dienNuocService) {
        this.dienNuocService = dienNuocService;
    }
    create(dto) {
        return this.dienNuocService.create(dto);
    }
    findAll() {
        return this.dienNuocService.findAll();
    }
    findOne(id) {
        return this.dienNuocService.findOne(id);
    }
    update(id, dto) {
        return this.dienNuocService.update(id, dto);
    }
    remove(id) {
        return this.dienNuocService.remove(id);
    }
};
exports.DienNuocController = DienNuocController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Điện Nước mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dien_nuoc_dto_1.CreateDienNuocDto]),
    __metadata("design:returntype", void 0)
], DienNuocController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Điện Nước' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DienNuocController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':idDienNuoc'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Điện Nước' }),
    (0, swagger_1.ApiParam)({ name: 'idDienNuoc', description: 'ID của Điện Nước' }),
    __param(0, (0, common_1.Param)('idDienNuoc', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DienNuocController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':idDienNuoc'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Điện Nước' }),
    __param(0, (0, common_1.Param)('idDienNuoc', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_dien_nuoc_dto_1.UpdateDienNuocDto]),
    __metadata("design:returntype", void 0)
], DienNuocController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':idDienNuoc'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Điện Nước' }),
    __param(0, (0, common_1.Param)('idDienNuoc', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DienNuocController.prototype, "remove", null);
exports.DienNuocController = DienNuocController = __decorate([
    (0, swagger_1.ApiTags)('Điện Nước'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('dien-nuoc'),
    __metadata("design:paramtypes", [dien_nuoc_service_1.DienNuocService])
], DienNuocController);
//# sourceMappingURL=dien-nuoc.controller.js.map