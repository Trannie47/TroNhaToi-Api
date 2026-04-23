"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const mockPrisma = {
    user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};
const mockJwt = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
};
const REGISTER_DTO = { username: 'admin', email: 'admin@nhatro.com', password: '123456' };
const LOGIN_DTO = { username: 'admin', password: '123456' };
describe('AuthService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
                { provide: jwt_1.JwtService, useValue: mockJwt },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        jest.clearAllMocks();
    });
    it('should be defined', () => expect(service).toBeDefined());
    describe('register()', () => {
        it('tạo user mới và trả về object không có password', async () => {
            mockPrisma.user.findFirst.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue({
                id: 1, username: 'admin', email: 'admin@nhatro.com',
                password: 'hashed', role: 'admin',
                createdAt: new Date(), updatedAt: new Date(),
            });
            const result = await service.register(REGISTER_DTO);
            expect(result).not.toHaveProperty('password');
            expect(result.username).toBe('admin');
            expect(result.email).toBe('admin@nhatro.com');
        });
        it('password được hash trước khi lưu vào DB', async () => {
            mockPrisma.user.findFirst.mockResolvedValue(null);
            let savedPassword = '';
            mockPrisma.user.create.mockImplementation(async ({ data }) => {
                savedPassword = data.password;
                return { id: 1, ...data, role: 'admin', createdAt: new Date(), updatedAt: new Date() };
            });
            await service.register(REGISTER_DTO);
            expect(savedPassword).not.toBe('123456');
            expect(await bcrypt.compare('123456', savedPassword)).toBe(true);
        });
        it('ném ConflictException khi username đã tồn tại', async () => {
            mockPrisma.user.findFirst.mockResolvedValue({ id: 1, username: 'admin' });
            await expect(service.register(REGISTER_DTO)).rejects.toThrow(common_1.ConflictException);
        });
        it('ném ConflictException khi email đã tồn tại', async () => {
            mockPrisma.user.findFirst.mockResolvedValue({ id: 2, email: 'admin@nhatro.com' });
            await expect(service.register(REGISTER_DTO)).rejects.toThrow(common_1.ConflictException);
        });
        it('không gọi create khi user đã tồn tại', async () => {
            mockPrisma.user.findFirst.mockResolvedValue({ id: 1 });
            try {
                await service.register(REGISTER_DTO);
            }
            catch { }
            expect(mockPrisma.user.create).not.toHaveBeenCalled();
        });
    });
    describe('login()', () => {
        let hashedPassword;
        beforeEach(async () => {
            hashedPassword = await bcrypt.hash('123456', 10);
        });
        it('trả về access_token khi đăng nhập thành công', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', email: 'admin@nhatro.com',
                password: hashedPassword, role: 'admin',
            });
            const result = await service.login(LOGIN_DTO);
            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toBe('mock-jwt-token');
        });
        it('trả về thông tin user trong response (không có password)', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', email: 'admin@nhatro.com',
                password: hashedPassword, role: 'admin',
            });
            const result = await service.login(LOGIN_DTO);
            expect(result.user).toBeDefined();
            expect(result.user).not.toHaveProperty('password');
            expect(result.user.username).toBe('admin');
        });
        it('jwt.sign được gọi với payload đúng', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', email: 'admin@nhatro.com',
                password: hashedPassword, role: 'admin',
            });
            await service.login(LOGIN_DTO);
            expect(mockJwt.sign).toHaveBeenCalledWith(expect.objectContaining({ sub: 1, username: 'admin', role: 'admin' }));
        });
        it('ném UnauthorizedException khi username không tồn tại', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            await expect(service.login(LOGIN_DTO)).rejects.toThrow(common_1.UnauthorizedException);
        });
        it('ném UnauthorizedException khi password sai', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', password: hashedPassword,
            });
            await expect(service.login({ username: 'admin', password: 'wrongpassword' }))
                .rejects.toThrow(common_1.UnauthorizedException);
        });
        it('không gọi jwt.sign khi password sai', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', password: hashedPassword,
            });
            try {
                await service.login({ username: 'admin', password: 'wrong' });
            }
            catch { }
            expect(mockJwt.sign).not.toHaveBeenCalled();
        });
    });
    describe('getProfile()', () => {
        it('trả về profile user không có password', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 1, username: 'admin', email: 'admin@nhatro.com',
                password: 'hashed', role: 'admin',
                createdAt: new Date(), updatedAt: new Date(),
            });
            const result = await service.getProfile(1);
            expect(result).not.toHaveProperty('password');
            expect(result.id).toBe(1);
        });
        it('ném UnauthorizedException khi userId không tồn tại', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);
            await expect(service.getProfile(9999)).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map