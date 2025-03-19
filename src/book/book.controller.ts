import { Body, Controller, Delete, Get, Param, Post,Put, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Get()
    async getAllBooks(): Promise<Book[]> {
        return await this.bookService.findAll();
    }


    //implemened authguard to protect the route
    //using the passport for it
    @Post('new')
    @UseGuards(AuthGuard())
    async createBook(@Body() book: CreateBookDto,@Req() req): Promise<Book> {
        return await this.bookService.create(book,req.user);
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
