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
exports.PhieuThuHangThangController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const phieu_thu_hang_thang_service_1 = require("../services/phieu-thu-hang-thang.service");
const create_phieu_thu_hang_thang_dto_1 = require("../dto/create-phieu-thu-hang-thang.dto");
const update_phieu_thu_hang_thang_dto_1 = require("../dto/update-phieu-thu-hang-thang.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PhieuThuHangThangController = class PhieuThuHangThangController {
    constructor(phieuThuHangThangService) {
        this.phieuThuHangThangService = phieuThuHangThangService;
    }
    create(dto) {
        return this.phieuThuHangThangService.create(dto);
    }
    findAll() {
        return this.phieuThuHangThangService.findAll();
    }
    findOne(id) {
        return this.phieuThuHangThangService.findOne(id);
    }
    update(id, dto) {
        return this.phieuThuHangThangService.update(id, dto);
    }
    remove(id) {
        return this.phieuThuHangThangService.remove(id);
    }
};
exports.PhieuThuHangThangController = PhieuThuHangThangController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Phiếu Thu Hàng Tháng mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_phieu_thu_hang_thang_dto_1.CreatePhieuThuHangThangDto]),
    __metadata("design:returntype", void 0)
], PhieuThuHangThangController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Phiếu Thu Hàng Tháng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhieuThuHangThangController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Phiếu Thu Hàng Tháng' }),
    (0, swagger_1.ApiParam)({ name: 'maPhieuThu', description: 'ID của Phiếu Thu Hàng Tháng' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhieuThuHangThangController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Phiếu Thu Hàng Tháng' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_phieu_thu_hang_thang_dto_1.UpdatePhieuThuHangThangDto]),
    __metadata("design:returntype", void 0)
], PhieuThuHangThangController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Phiếu Thu Hàng Tháng' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhieuThuHangThangController.prototype, "remove", null);
exports.PhieuThuHangThangController = PhieuThuHangThangController = __decorate([
    (0, swagger_1.ApiTags)('Phiếu Thu Hàng Tháng'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('phieu-thu-hang-thang'),
    __metadata("design:paramtypes", [phieu_thu_hang_thang_service_1.PhieuThuHangThangService])
], PhieuThuHangThangController);
//# sourceMappingURL=phieu-thu-hang-thang.controller.js.map