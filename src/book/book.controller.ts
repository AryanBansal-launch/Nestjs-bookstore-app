import { Body, Controller, Delete, Get, Param, Post,Put } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return await this.bookService.findAll();
    }

    @Post('new')
    async createBook(@Body() book: CreateBookDto): Promise<Book> {
        return await this.bookService.create(book);
    }

    @Get(':id')
    async getBookById(@Param('id') id: string): Promise<Book> {
        return await this.bookService.findById(id);
    }

    @Put('update/:id')
    async updateBook(@Param('id') id: string, @Body() book: UpdateBookDto): Promise<Book> {
        return await this.bookService.updateById(id, book);
    }

    @Delete('delete/:id')
    async deleteBook(@Param('id') id: string): Promise<Book> {
        return await this.bookService.deleteById(id);
    }
}
