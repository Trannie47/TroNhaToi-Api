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
exports.PhieuThuHangThangService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PhieuThuHangThangService = class PhieuThuHangThangService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.phieuThuHangThang.findMany({
            include: { hoaDonPhong: { include: { hopDong: { include: { nguoiThue: true, phong: true } } } } },
        });
    }
    async findOne(id) {
        const item = await this.prisma.phieuThuHangThang.findUnique({
            where: { maPhieuThu: id },
            include: { hoaDonPhong: { include: { hopDong: { include: { nguoiThue: true, phong: true } } } } },
        });
        if (!item)
            throw new common_1.NotFoundException(`PhieuThuHangThang với id ${id} không tồn tại`);
        return item;
    }
    create(dto) {
        return this.prisma.phieuThuHangThang.create({ data: dto });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.phieuThuHangThang.update({ where: { maPhieuThu: id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.phieuThuHangThang.delete({ where: { maPhieuThu: id } });
    }
};
exports.PhieuThuHangThangService = PhieuThuHangThangService;
exports.PhieuThuHangThangService = PhieuThuHangThangService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PhieuThuHangThangService);
//# sourceMappingURL=phieu-thu-hang-thang.service.js.map