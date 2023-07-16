import { Controller, Get, UseGuards, Param, Post, Body, Delete, HttpCode, HttpStatus } from '@nestjs/common';

// Service
import { BookmarkService } from './bookmark.service';

// Guard
import { JwtGuard } from 'src/auth/guard';

// Decorators
import { GetUser } from 'src/auth/decorator';

// DTO
import { CreateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('id') userId: string) {
        const bookmarks = this.bookmarkService.getBookmarks(userId);
        return bookmarks;
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    createBookmark(@GetUser('id') userId: string, @Body() createBookmarkDto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, createBookmarkDto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmark(@GetUser('id') userId: string, @Param('id') bookmarkId: string) {
        return this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }
}
