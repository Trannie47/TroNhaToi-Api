import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
