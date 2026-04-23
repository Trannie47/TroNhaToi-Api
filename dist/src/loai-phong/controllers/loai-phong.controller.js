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
exports.LoaiPhongController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loai_phong_service_1 = require("../services/loai-phong.service");
const create_loai_phong_dto_1 = require("../dto/create-loai-phong.dto");
const update_loai_phong_dto_1 = require("../dto/update-loai-phong.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let LoaiPhongController = class LoaiPhongController {
    constructor(loaiPhongService) {
        this.loaiPhongService = loaiPhongService;
    }
    create(dto) {
        return this.loaiPhongService.create(dto);
    }
    findAll() {
        return this.loaiPhongService.findAll();
    }
    findOne(id) {
        return this.loaiPhongService.findOne(id);
    }
    update(id, dto) {
        return this.loaiPhongService.update(id, dto);
    }
    remove(id) {
        return this.loaiPhongService.remove(id);
    }
};
exports.LoaiPhongController = LoaiPhongController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Loại Phòng mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_loai_phong_dto_1.CreateLoaiPhongDto]),
    __metadata("design:returntype", void 0)
], LoaiPhongController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Loại Phòng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoaiPhongController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':maLoaiPhong'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Loại Phòng' }),
    (0, swagger_1.ApiParam)({ name: 'maLoaiPhong', description: 'ID của Loại Phòng' }),
    __param(0, (0, common_1.Param)('maLoaiPhong', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LoaiPhongController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':maLoaiPhong'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Loại Phòng' }),
    __param(0, (0, common_1.Param)('maLoaiPhong', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_loai_phong_dto_1.UpdateLoaiPhongDto]),
    __metadata("design:returntype", void 0)
], LoaiPhongController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':maLoaiPhong'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Loại Phòng' }),
    __param(0, (0, common_1.Param)('maLoaiPhong', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LoaiPhongController.prototype, "remove", null);
exports.LoaiPhongController = LoaiPhongController = __decorate([
    (0, swagger_1.ApiTags)('Loại Phòng'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('loai-phong'),
    __metadata("design:paramtypes", [loai_phong_service_1.LoaiPhongService])
], LoaiPhongController);
//# sourceMappingURL=loai-phong.controller.js.map