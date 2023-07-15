import { Module } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// Controller
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
