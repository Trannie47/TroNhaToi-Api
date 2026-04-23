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
exports.HoaDonTapHoaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hoa_don_tap_hoa_service_1 = require("../services/hoa-don-tap-hoa.service");
const create_hoa_don_tap_hoa_dto_1 = require("../dto/create-hoa-don-tap-hoa.dto");
const update_hoa_don_tap_hoa_dto_1 = require("../dto/update-hoa-don-tap-hoa.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let HoaDonTapHoaController = class HoaDonTapHoaController {
    constructor(hoaDonTapHoaService) {
        this.hoaDonTapHoaService = hoaDonTapHoaService;
    }
    create(dto) {
        return this.hoaDonTapHoaService.create(dto);
    }
    findAll() {
        return this.hoaDonTapHoaService.findAll();
    }
    findOne(id) {
        return this.hoaDonTapHoaService.findOne(id);
    }
    update(id, dto) {
        return this.hoaDonTapHoaService.update(id, dto);
    }
    remove(id) {
        return this.hoaDonTapHoaService.remove(id);
    }
};
exports.HoaDonTapHoaController = HoaDonTapHoaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Hóa Đơn Tạp Hóa mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hoa_don_tap_hoa_dto_1.CreateHoaDonTapHoaDto]),
    __metadata("design:returntype", void 0)
], HoaDonTapHoaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Hóa Đơn Tạp Hóa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HoaDonTapHoaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Hóa Đơn Tạp Hóa' }),
    (0, swagger_1.ApiParam)({ name: 'maHoaDon', description: 'ID của Hóa Đơn Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonTapHoaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Hóa Đơn Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hoa_don_tap_hoa_dto_1.UpdateHoaDonTapHoaDto]),
    __metadata("design:returntype", void 0)
], HoaDonTapHoaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Hóa Đơn Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonTapHoaController.prototype, "remove", null);
exports.HoaDonTapHoaController = HoaDonTapHoaController = __decorate([
    (0, swagger_1.ApiTags)('Hóa Đơn Tạp Hóa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hoa-don-tap-hoa'),
    __metadata("design:paramtypes", [hoa_don_tap_hoa_service_1.HoaDonTapHoaService])
], HoaDonTapHoaController);
//# sourceMappingURL=hoa-don-tap-hoa.controller.js.map