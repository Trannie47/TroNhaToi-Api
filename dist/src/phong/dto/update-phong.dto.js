"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhongDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_phong_dto_1 = require("./create-phong.dto");
class UpdatePhongDto extends (0, mapped_types_1.PartialType)(create_phong_dto_1.CreatePhongDto) {
}
exports.UpdatePhongDto = UpdatePhongDto;
//# sourceMappingURL=update-phong.dto.js.map