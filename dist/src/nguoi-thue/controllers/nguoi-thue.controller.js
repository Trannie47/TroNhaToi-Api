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
exports.NguoiThueController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nguoi_thue_service_1 = require("../services/nguoi-thue.service");
const create_nguoi_thue_dto_1 = require("../dto/create-nguoi-thue.dto");
const update_nguoi_thue_dto_1 = require("../dto/update-nguoi-thue.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let NguoiThueController = class NguoiThueController {
    constructor(nguoiThueService) {
        this.nguoiThueService = nguoiThueService;
    }
    create(dto) {
        return this.nguoiThueService.create(dto);
    }
    findAll() {
        return this.nguoiThueService.findAll();
    }
    findOne(id) {
        return this.nguoiThueService.findOne(id);
    }
    update(id, dto) {
        return this.nguoiThueService.update(id, dto);
    }
    remove(id) {
        return this.nguoiThueService.remove(id);
    }
};
exports.NguoiThueController = NguoiThueController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo Người Thuê mới' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_nguoi_thue_dto_1.CreateNguoiThueDto]),
    __metadata("design:returntype", void 0)
], NguoiThueController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Danh sách Người Thuê' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NguoiThueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':idnt'),
    (0, swagger_1.ApiOperation)({ summary: 'Chi tiết Người Thuê' }),
    (0, swagger_1.ApiParam)({ name: 'idnt', description: 'ID của Người Thuê' }),
    __param(0, (0, common_1.Param)('idnt', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NguoiThueController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':idnt'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật Người Thuê' }),
    __param(0, (0, common_1.Param)('idnt', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_nguoi_thue_dto_1.UpdateNguoiThueDto]),
    __metadata("design:returntype", void 0)
], NguoiThueController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':idnt'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa Người Thuê' }),
    __param(0, (0, common_1.Param)('idnt', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], NguoiThueController.prototype, "remove", null);
exports.NguoiThueController = NguoiThueController = __decorate([
    (0, swagger_1.ApiTags)('Người Thuê'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('nguoi-thue'),
    __metadata("design:paramtypes", [nguoi_thue_service_1.NguoiThueService])
], NguoiThueController);
//# sourceMappingURL=nguoi-thue.controller.js.map