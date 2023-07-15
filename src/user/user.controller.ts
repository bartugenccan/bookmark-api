import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';

// Guard
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    @Get("me")
    @UseGuards(JwtGuard)
    getUser(@Req() req: Request) {
        return req.user;
    }
}
