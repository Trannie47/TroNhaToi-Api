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
exports.HangHoaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const hang_hoa_service_1 = require("../services/hang-hoa.service");
const create_hang_hoa_dto_1 = require("../dto/create-hang-hoa.dto");
const update_hang_hoa_dto_1 = require("../dto/update-hang-hoa.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let HangHoaController = class HangHoaController {
    constructor(hangHoaService) {
        this.hangHoaService = hangHoaService;
    }
    create(dto) {
        return this.hangHoaService.create(dto);
    }
    findAll() {
        return this.hangHoaService.findAll();
    }
    findOne(id) {
        return this.hangHoaService.findOne(id);
    }
    update(id, dto) {
        return this.hangHoaService.update(id, dto);
    }
    remove(id) {
        return this.hangHoaService.remove(id);
    }
};
exports.HangHoaController = HangHoaController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Hàng Hóa mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hang_hoa_dto_1.CreateHangHoaDto]),
    __metadata("design:returntype", void 0)
], HangHoaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Hàng Hóa' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HangHoaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maHangHoa'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Hàng Hóa' }),
    (0, swagger_1.ApiParam)({ name: 'maHangHoa', description: 'ID của Hàng Hóa' }),
    __param(0, (0, common_1.Param)('maHangHoa', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HangHoaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maHangHoa'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Hàng Hóa' }),
    __param(0, (0, common_1.Param)('maHangHoa', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hang_hoa_dto_1.UpdateHangHoaDto]),
    __metadata("design:returntype", void 0)
], HangHoaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maHangHoa'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Hàng Hóa' }),
    __param(0, (0, common_1.Param)('maHangHoa', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HangHoaController.prototype, "remove", null);
exports.HangHoaController = HangHoaController = __decorate([
    (0, swagger_1.ApiTags)('Hàng Hóa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hang-hoa'),
    __metadata("design:paramtypes", [hang_hoa_service_1.HangHoaService])
], HangHoaController);
//# sourceMappingURL=hang-hoa.controller.js.map