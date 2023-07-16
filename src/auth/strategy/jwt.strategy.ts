import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("JWT_SECRET"),
        })
    }

    async validate(payload: { sub: string, email: string }) {

        const user = await this.prismaService.user.findUnique({
            where: {
                email: payload.email
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                firstName: true,
                lastName: true
            }
        })

        return user;
    }
}