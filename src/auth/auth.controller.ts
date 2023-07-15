import { Controller, Get, Post, Body } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// DTO
import { RegisterDto } from './dto';

// Model
import { User } from '@prisma/client';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signUp(@Body() registerDto: RegisterDto): Promise<User> {
        return this.authService.signUp(registerDto);
    }

}
