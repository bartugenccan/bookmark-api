import { Module } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// Controller
import { AuthController } from './auth.controller';

// Module
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
