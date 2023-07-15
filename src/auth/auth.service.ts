import { ForbiddenException, Injectable } from '@nestjs/common';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

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

    constructor(private prisma: PrismaService) { }

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
     * @returns The signed in user.
     */
    async signIn(loginDto: LoginDto): Promise<User> {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                updatedAt: true,
                firstName: true,
                lastName: true,
                hash: true
            }
        });

        if (!user) {
            throw new ForbiddenException("Credentials incorrect.");
        }

        const { hash, ...userWithoutHash } = user;

        const pwMatches: boolean = await argon.verify(hash, password);

        if (!pwMatches) {
            throw new ForbiddenException("Credentials incorrect.");
        }

        return userWithoutHash as User;
    }
}
