import { ForbiddenException, Injectable } from '@nestjs/common';
import { Bookmark } from '@prisma/client';

// Service
import { PrismaService } from 'src/prisma/prisma.service';

// DTOS
import { CreateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prismaService: PrismaService) { }

    /**
     * Retrieves all bookmarks for a given user.
     *
     * @param userId - The ID of the user.
     * @returns An array of bookmarks.
     */
    getBookmarks(userId: string) {
        // Retrieve all bookmarks for the given user ID
        return this.prismaService.bookmark.findMany({
            where: { userId }
        });
    }

    /**
     * Retrieves a bookmark by its ID.
     * @param {string} userId - The ID of the user who owns the bookmark.
     * @param {string} bookmarkId - The ID of the bookmark.
     * @returns {Promise<Bookmark>} - The bookmark object.
     */
    async getBookmarkById(userId: string, bookmarkId: string): Promise<Bookmark> {
        return this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
                userId
            },
        });
    }


    /**
     * Creates a new bookmark for a user.
     * 
     * @param userId - The ID of the user.
     * @param createBookmarkDto - The data for creating the bookmark.
     * @returns A Promise that resolves to the created bookmark.
     */
    async createBookmark(userId: string, createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
        return await this.prismaService.bookmark.create({
            data: {
                ...createBookmarkDto,
                userId
            }
        });
    }

    async deleteBookmark(userId: string, bookmarkId: string) {
        const bookmark = await this.prismaService.bookmark.findUnique({
            where: {
                id: bookmarkId,
            }
        })

        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Bookmark not found')
        }

        await this.prismaService.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}
