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
exports.UpdateLapRapDto = exports.CreateLapRapDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateLapRapDto {
}
exports.CreateLapRapDto = CreateLapRapDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID phòng' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLapRapDto.prototype, "phongId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID thiết bị' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLapRapDto.prototype, "thietBiId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ngày lắp (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLapRapDto.prototype, "ngayLap", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Số lượng' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLapRapDto.prototype, "soLuong", void 0);
class UpdateLapRapDto extends (0, mapped_types_1.PartialType)(CreateLapRapDto) {
}
exports.UpdateLapRapDto = UpdateLapRapDto;
//# sourceMappingURL=create-lap-rap.dto.js.map