import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.provider';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService,private cloudinaryService: CloudinaryService) {}

  @Get()
  @Roles(Role.Moderator, Role.User)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllBooks(): Promise<Book[]> {
    return await this.bookService.findAll();
  }

  //implemened authguard using passport jwt strategy
  //using the passport for it
  @Post('new')
  @UseGuards(AuthGuard('jwt'))
  async createBook(@Body() book: CreateBookDto, @Req() req): Promise<Book> {
    return await this.bookService.create(book, req.user);
  }

  @Get(':id')
  async getBookById(@Param('id') id: string): Promise<Book> {
    return await this.bookService.findById(id);
  }

  @Put('update/:id')
  async updateBook(
    @Param('id') id: string,
    @Body() book: UpdateBookDto,
  ): Promise<Book> {
    return await this.bookService.updateById(id, book);
  }

  @Delete('delete/:id')
  async deleteBook(@Param('id') id: string): Promise<Book> {
    return await this.bookService.deleteById(id);
  }

  @Put('upload/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('file'))
    async uploadImages(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<Book> {
        return this.bookService.uploadBookImage(id, file);
    }
    
}
