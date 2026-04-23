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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhieuThuHangThangDto = exports.CreatePhieuThuHangThangDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreatePhieuThuHangThangDto {
}
exports.CreatePhieuThuHangThangDto = CreatePhieuThuHangThangDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày thu (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhieuThuHangThangDto.prototype, "ngayThu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Số tiền' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePhieuThuHangThangDto.prototype, "soTien", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ghi chú' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhieuThuHangThangDto.prototype, "ghiChu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mã hóa đơn phòng' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePhieuThuHangThangDto.prototype, "maHoaDon", void 0);
class UpdatePhieuThuHangThangDto extends (0, mapped_types_1.PartialType)(CreatePhieuThuHangThangDto) {
}
exports.UpdatePhieuThuHangThangDto = UpdatePhieuThuHangThangDto;
//# sourceMappingURL=create-phieu-thu-hang-thang.dto.js.map