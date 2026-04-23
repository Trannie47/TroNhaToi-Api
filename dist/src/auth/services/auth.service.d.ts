import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            role: string;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
