"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhuongTienDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_phuong_tien_dto_1 = require("./create-phuong-tien.dto");
class UpdatePhuongTienDto extends (0, mapped_types_1.PartialType)(create_phuong_tien_dto_1.CreatePhuongTienDto) {
}
exports.UpdatePhuongTienDto = UpdatePhuongTienDto;
//# sourceMappingURL=update-phuong-tien.dto.js.map