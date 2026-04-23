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
exports.PhieuThuHdThController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const phieu_thu_hdth_service_1 = require("../services/phieu-thu-hdth.service");
const create_phieu_thu_hdth_dto_1 = require("../dto/create-phieu-thu-hdth.dto");
const update_phieu_thu_hdth_dto_1 = require("../dto/update-phieu-thu-hdth.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PhieuThuHdThController = class PhieuThuHdThController {
    constructor(phieuThuHdThService) {
        this.phieuThuHdThService = phieuThuHdThService;
    }
    create(dto) {
        return this.phieuThuHdThService.create(dto);
    }
    findAll() {
        return this.phieuThuHdThService.findAll();
    }
    findOne(id) {
        return this.phieuThuHdThService.findOne(id);
    }
    update(id, dto) {
        return this.phieuThuHdThService.update(id, dto);
    }
    remove(id) {
        return this.phieuThuHdThService.remove(id);
    }
};
exports.PhieuThuHdThController = PhieuThuHdThController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Phiếu Thu HĐ Tạp Hóa mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_phieu_thu_hdth_dto_1.CreatePhieuThuHdThDto]),
    __metadata("design:returntype", void 0)
], PhieuThuHdThController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Phiếu Thu HĐ Tạp Hóa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhieuThuHdThController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Phiếu Thu HĐ Tạp Hóa' }),
    (0, swagger_1.ApiParam)({ name: 'maPhieuThu', description: 'ID của Phiếu Thu HĐ Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhieuThuHdThController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Phiếu Thu HĐ Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_phieu_thu_hdth_dto_1.UpdatePhieuThuHdThDto]),
    __metadata("design:returntype", void 0)
], PhieuThuHdThController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maPhieuThu'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Phiếu Thu HĐ Tạp Hóa' }),
    __param(0, (0, common_1.Param)('maPhieuThu', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PhieuThuHdThController.prototype, "remove", null);
exports.PhieuThuHdThController = PhieuThuHdThController = __decorate([
    (0, swagger_1.ApiTags)('Phiếu Thu HĐ Tạp Hóa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('phieu-thu-hdth'),
    __metadata("design:paramtypes", [phieu_thu_hdth_service_1.PhieuThuHdThService])
], PhieuThuHdThController);
//# sourceMappingURL=phieu-thu-hdth.controller.js.map