import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './schemas/book.schema';
import { isValidObjectId } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel:mongoose.Model<Book>
    ){}

    async findAll():Promise<Book[]>{
        const books=await this.bookModel.find();
        return books;
    }

    async create(book:Book,user:User):Promise<Book>{
        const data=Object.assign(book,{user:user._id});

        const newBook=await this.bookModel.create(data);
        return newBook;
    }
    async findById(id: string): Promise<Book> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}. Please enter a valid ID`);
        }

        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return book;
    }
    async updateById(id: string, book:Book): Promise<Book> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, book, { new: true, runValidators: true });
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }
    async deleteById(id: string): Promise<Book> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException(`Invalid ID format: ${id}`);
        }
        const updatedBook = await this.bookModel.findByIdAndDelete(id);
        if (!updatedBook) {
            throw new NotFoundException(`Book with ID ${id} not found`);
        }
        return updatedBook;
    }
      
}
