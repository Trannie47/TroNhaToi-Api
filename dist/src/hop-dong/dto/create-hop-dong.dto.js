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
exports.UpdateHopDongDto = exports.CreateHopDongDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateHopDongDto {
}
exports.CreateHopDongDto = CreateHopDongDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID người thuê' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateHopDongDto.prototype, "idnt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID phòng' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateHopDongDto.prototype, "phongId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày ký (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "ngayKy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày hết hạn (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "ngayHetHan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tiền cọc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHopDongDto.prototype, "tienCoc", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Giá phòng thực tế' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHopDongDto.prototype, "giaPhongThucTe", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trạng thái (dangThue/hetHan/huyBo)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHopDongDto.prototype, "trangThai", void 0);
class UpdateHopDongDto extends (0, mapped_types_1.PartialType)(CreateHopDongDto) {
}
exports.UpdateHopDongDto = UpdateHopDongDto;
//# sourceMappingURL=create-hop-dong.dto.js.map