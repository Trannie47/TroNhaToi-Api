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
exports.HoaDonSuaChuaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hoa_don_sua_chua_service_1 = require("../services/hoa-don-sua-chua.service");
const create_hoa_don_sua_chua_dto_1 = require("../dto/create-hoa-don-sua-chua.dto");
const update_hoa_don_sua_chua_dto_1 = require("../dto/update-hoa-don-sua-chua.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let HoaDonSuaChuaController = class HoaDonSuaChuaController {
    constructor(hoaDonSuaChuaService) {
        this.hoaDonSuaChuaService = hoaDonSuaChuaService;
    }
    create(dto) {
        return this.hoaDonSuaChuaService.create(dto);
    }
    findAll() {
        return this.hoaDonSuaChuaService.findAll();
    }
    findOne(id) {
        return this.hoaDonSuaChuaService.findOne(id);
    }
    update(id, dto) {
        return this.hoaDonSuaChuaService.update(id, dto);
    }
    remove(id) {
        return this.hoaDonSuaChuaService.remove(id);
    }
};
exports.HoaDonSuaChuaController = HoaDonSuaChuaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Hóa Đơn Sửa Chữa mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hoa_don_sua_chua_dto_1.CreateHoaDonSuaChuaDto]),
    __metadata("design:returntype", void 0)
], HoaDonSuaChuaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Hóa Đơn Sửa Chữa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HoaDonSuaChuaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maHoaDonSc'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Hóa Đơn Sửa Chữa' }),
    (0, swagger_1.ApiParam)({ name: 'maHoaDonSc', description: 'ID của Hóa Đơn Sửa Chữa' }),
    __param(0, (0, common_1.Param)('maHoaDonSc', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonSuaChuaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maHoaDonSc'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Hóa Đơn Sửa Chữa' }),
    __param(0, (0, common_1.Param)('maHoaDonSc', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hoa_don_sua_chua_dto_1.UpdateHoaDonSuaChuaDto]),
    __metadata("design:returntype", void 0)
], HoaDonSuaChuaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maHoaDonSc'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Hóa Đơn Sửa Chữa' }),
    __param(0, (0, common_1.Param)('maHoaDonSc', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonSuaChuaController.prototype, "remove", null);
exports.HoaDonSuaChuaController = HoaDonSuaChuaController = __decorate([
    (0, swagger_1.ApiTags)('Hóa Đơn Sửa Chữa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hoa-don-sua-chua'),
    __metadata("design:paramtypes", [hoa_don_sua_chua_service_1.HoaDonSuaChuaService])
], HoaDonSuaChuaController);
//# sourceMappingURL=hoa-don-sua-chua.controller.js.map