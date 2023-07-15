import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

// Guard
import { JwtGuard } from 'src/auth/guard';

// Decorator
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get("me")
    getUser(@GetUser() user: User) {
        return user;
    }
}
