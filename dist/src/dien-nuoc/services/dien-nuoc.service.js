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
exports.DienNuocService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DienNuocService = class DienNuocService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.dienNuoc.findMany({
            include: { phong: { select: { phongId: true, tenPhong: true } } },
        });
    }
    async findOne(id) {
        const item = await this.prisma.dienNuoc.findUnique({
            where: { idDienNuoc: id },
            include: { phong: { select: { phongId: true, tenPhong: true } } },
        });
        if (!item)
            throw new common_1.NotFoundException(`DienNuoc với id ${id} không tồn tại`);
        return item;
    }
    create(dto) {
        return this.prisma.dienNuoc.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.dienNuoc.update({ where: { idDienNuoc: id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.dienNuoc.delete({ where: { idDienNuoc: id } });
    }
};
exports.DienNuocService = DienNuocService;
exports.DienNuocService = DienNuocService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DienNuocService);
//# sourceMappingURL=dien-nuoc.service.js.map