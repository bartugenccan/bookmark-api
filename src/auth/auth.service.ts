import { ForbiddenException, Injectable } from '@nestjs/common';

// Services
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// DTOS
import { LoginDto, RegisterDto } from './dto';

// Models
import { User } from '@prisma/client';

// Argon
import * as argon from 'argon2';

// Errors
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService, private configService: ConfigService) { }

    /**
     * Sign up a user.
     *
     * @param {RegisterDto} registerDto - The registration data for the user.
     * @returns {Promise<User>} A promise that resolves to the created user.
     */
    async signUp(registerDto: RegisterDto): Promise<User> {
        const { email, password, firstName, lastName } = registerDto;

        const hash: string = await argon.hash(password);

        try {
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    hash,
                    firstName,
                    lastName,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                    firstName: true,
                    lastName: true
                }
            });
            return newUser as User;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
                throw new ForbiddenException("Credentials taken.");
            }
            throw error;
        }
    }


    /**
     * Sign in a user.
     * 
     * @param loginDto - The login credentials.
     * @returns The signed in user's access token.
     */
    async signIn(loginDto: LoginDto): Promise<{ access_token: string }> {
        const { email, password } = loginDto;

        // Find the user with the given email and select specific fields
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
        });

        // Check if user exists and if the password is correct
        if (!user || !(await argon.verify(user.hash, password))) {
            // Throw an exception if credentials are incorrect
            throw new ForbiddenException("Credentials incorrect.");
        }

        // Generate and return the access token for the user
        return this.signToken(user.id, user.email);
    }

    /**
     * Signs a token with the given user ID and email.
     * @param userId The user ID.
     * @param email The email.
     * @returns An object containing the access token.
     */
    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = { sub: userId, email };
        const secret = this.configService.get('JWT_SECRET');
        const expiresIn = '15m';

        const access_token = this.jwtService.sign(payload, { secret, expiresIn });

        return { access_token };
    }
}