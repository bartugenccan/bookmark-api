import { Injectable } from '@nestjs/common';

// Services
import { PrismaService } from 'src/prisma/prisma.service';

// DTOS
import { LoginDto, RegisterDto } from './dto';

// Models
import { User } from '@prisma/client';

// Argon
import * as argon from 'argon2';

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
                firstName: true,
                lastName: true
            }
        }).catch((error) => {
            throw new Error(`Failed to sign up user: ${error.message}`);
        });

        return newUser as User;
    }


    signIn() {
    }
}
