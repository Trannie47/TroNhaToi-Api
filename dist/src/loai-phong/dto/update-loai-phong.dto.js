"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLoaiPhongDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_loai_phong_dto_1 = require("./create-loai-phong.dto");
class UpdateLoaiPhongDto extends (0, mapped_types_1.PartialType)(create_loai_phong_dto_1.CreateLoaiPhongDto) {
}
exports.UpdateLoaiPhongDto = UpdateLoaiPhongDto;
//# sourceMappingURL=update-loai-phong.dto.js.map