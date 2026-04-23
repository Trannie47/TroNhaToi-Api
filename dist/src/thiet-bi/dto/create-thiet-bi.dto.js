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
exports.UpdateThietBiDto = exports.CreateThietBiDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateThietBiDto {
}
exports.CreateThietBiDto = CreateThietBiDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tên thiết bị' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateThietBiDto.prototype, "tenThietBi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Loại thiết bị' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateThietBiDto.prototype, "loai", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Giá trị' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateThietBiDto.prototype, "giaTri", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày mua (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateThietBiDto.prototype, "ngayMua", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trạng thái' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateThietBiDto.prototype, "trangThai", void 0);
class UpdateThietBiDto extends (0, mapped_types_1.PartialType)(CreateThietBiDto) {
}
exports.UpdateThietBiDto = UpdateThietBiDto;
//# sourceMappingURL=create-thiet-bi.dto.js.map