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
exports.UpdatePhieuThuHdThDto = exports.CreatePhieuThuHdThDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreatePhieuThuHdThDto {
}
exports.CreatePhieuThuHdThDto = CreatePhieuThuHdThDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày thu (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhieuThuHdThDto.prototype, "ngayThu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Số tiền' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePhieuThuHdThDto.prototype, "soTien", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Người đóng' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhieuThuHdThDto.prototype, "nguoiDong", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mã hóa đơn tạp hóa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePhieuThuHdThDto.prototype, "maHoaDon", void 0);
class UpdatePhieuThuHdThDto extends (0, mapped_types_1.PartialType)(CreatePhieuThuHdThDto) {
}
exports.UpdatePhieuThuHdThDto = UpdatePhieuThuHdThDto;
//# sourceMappingURL=create-phieu-thu-hdth.dto.js.map