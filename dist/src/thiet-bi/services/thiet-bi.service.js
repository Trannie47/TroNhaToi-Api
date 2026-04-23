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
exports.ThietBiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ThietBiService = class ThietBiService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.thietBi.findMany({
            include: { lapRap: { include: { phong: true } } },
        });
    }
    async findOne(id) {
        const item = await this.prisma.thietBi.findUnique({
            where: { thietBiId: id },
            include: { lapRap: { include: { phong: true } } },
        });
        if (!item)
            throw new common_1.NotFoundException(`ThietBi với id ${id} không tồn tại`);
        return item;
    }
    create(dto) {
        return this.prisma.thietBi.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.thietBi.update({ where: { thietBiId: id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.thietBi.delete({ where: { thietBiId: id } });
    }
};
exports.ThietBiService = ThietBiService;
exports.ThietBiService = ThietBiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThietBiService);
//# sourceMappingURL=thiet-bi.service.js.map