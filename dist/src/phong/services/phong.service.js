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
exports.PhongService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PhongService = class PhongService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.phong.findMany({
            include: { loaiPhong: true, hopDong: { include: { nguoiThue: true } }, dienNuoc: true, lapRap: { include: { thietBi: true } }, nguoiLuuTruTamThoi: true },
        });
    }
    async findOne(id) {
        const item = await this.prisma.phong.findUnique({
            where: { phongId: id },
            include: { loaiPhong: true, hopDong: { include: { nguoiThue: true } }, dienNuoc: true, lapRap: { include: { thietBi: true } }, nguoiLuuTruTamThoi: true },
        });
        if (!item)
            throw new common_1.NotFoundException(`Phong với id ${id} không tồn tại`);
        return item;
    }
    create(dto) {
        return this.prisma.phong.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.phong.update({ where: { phongId: id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.phong.delete({ where: { phongId: id } });
    }
};
exports.PhongService = PhongService;
exports.PhongService = PhongService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhongService);
//# sourceMappingURL=phong.service.js.map