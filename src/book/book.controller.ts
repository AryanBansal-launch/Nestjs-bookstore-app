import { Body, Controller, Delete, Get, Param, Post,Put, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) {}

    @Roles(Role.Moderator,Role.Admin)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get()
    async getAllBooks(): Promise<Book[]> {
        return await this.bookService.findAll();
    }

    //implemened authguard using passport jwt strategy
    //using the passport for it
    @Post('new')
    @UseGuards(AuthGuard('jwt'))
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
