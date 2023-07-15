import { Module } from '@nestjs/common';

// Service
import { AuthService } from './auth.service';

// Controller
import { AuthController } from './auth.controller';

// Module
import { JwtModule } from '@nestjs/jwt';

// Strategy
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
