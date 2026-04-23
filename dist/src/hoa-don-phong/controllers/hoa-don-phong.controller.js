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
exports.HoaDonPhongController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hoa_don_phong_service_1 = require("../services/hoa-don-phong.service");
const create_hoa_don_phong_dto_1 = require("../dto/create-hoa-don-phong.dto");
const update_hoa_don_phong_dto_1 = require("../dto/update-hoa-don-phong.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let HoaDonPhongController = class HoaDonPhongController {
    constructor(hoaDonPhongService) {
        this.hoaDonPhongService = hoaDonPhongService;
    }
    create(dto) {
        return this.hoaDonPhongService.create(dto);
    }
    findAll() {
        return this.hoaDonPhongService.findAll();
    }
    findOne(id) {
        return this.hoaDonPhongService.findOne(id);
    }
    update(id, dto) {
        return this.hoaDonPhongService.update(id, dto);
    }
    remove(id) {
        return this.hoaDonPhongService.remove(id);
    }
};
exports.HoaDonPhongController = HoaDonPhongController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Hóa Đơn Phòng mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hoa_don_phong_dto_1.CreateHoaDonPhongDto]),
    __metadata("design:returntype", void 0)
], HoaDonPhongController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Hóa Đơn Phòng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HoaDonPhongController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Hóa Đơn Phòng' }),
    (0, swagger_1.ApiParam)({ name: 'maHoaDon', description: 'ID của Hóa Đơn Phòng' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonPhongController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Hóa Đơn Phòng' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hoa_don_phong_dto_1.UpdateHoaDonPhongDto]),
    __metadata("design:returntype", void 0)
], HoaDonPhongController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maHoaDon'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Hóa Đơn Phòng' }),
    __param(0, (0, common_1.Param)('maHoaDon', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HoaDonPhongController.prototype, "remove", null);
exports.HoaDonPhongController = HoaDonPhongController = __decorate([
    (0, swagger_1.ApiTags)('Hóa Đơn Phòng'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hoa-don-phong'),
    __metadata("design:paramtypes", [hoa_don_phong_service_1.HoaDonPhongService])
], HoaDonPhongController);
//# sourceMappingURL=hoa-don-phong.controller.js.map