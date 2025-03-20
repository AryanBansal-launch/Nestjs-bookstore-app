import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { mock } from 'node:test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from 'src/auth/schemas/user.schema';

describe('BookService', () => {
  let bookservice: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '65f1234567890abcdef12345',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description:
      "A fantasy novel about Bilbo Baggins' adventure to reclaim treasure from a dragon.",
    price: 499,
    category: Category.FANTASY,
    user: '65f1234567890abcdef12345',
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Aryan',
    email: 'aryan1@gmail.com',
  };

  //we need to mock the services/methods, as we do not actually call to DB's
  const mockBookService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };
  //provide the services/providers that run before the tests
  //it initializes all the data that will be needed for the tests
  //seeting up the Bookservice and providing it's methods to mock tests
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();
    bookservice = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  //testing the findbyId method
  describe('fidnById', () => {
    it('should find and return a book by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      const result = await bookservice.findById(mockBook._id);
      expect(result).toEqual(mockBook);
    });
    it('should throw the BadRequestException when invalid ID is provided', async () => {
      const id = 'invalid-request';
      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(bookservice.findById(id)).rejects.toThrow(
        BadRequestException,
      );
      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });
    it('should throw the NotFoundException when book is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(bookservice.findById(mockBook._id)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });

  //testing findAll method
  describe('findAll', () => {
    it('should return all books', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockBook]);
      const result = await bookservice.findAll();
      expect(result).toEqual([mockBook]);
    });
  });

  //testing create method
  describe('create', () => {
    it('should create a book', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          ...mockBook,
        } as any),
      );
      const mockBook2 = {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        description:
          "A fantasy novel about Bilbo Baggins' adventure to reclaim treasure from a dragon.",
        price: 499,
        category: Category.FANTASY,
      };
      const result = await bookservice.create(
        mockBook2 as CreateBookDto,
        mockUser as unknown as User,
      );
      expect(result).toEqual(mockBook);
    });
  });

  //testing updateById method
  describe('updateById', () => {
    it('should update and return a book', async () => {
      const updatedBook = { ...mockBook, title: 'Updated name' };
      const book = { title: 'Updated name' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

      const result = await bookservice.updateById(mockBook._id, book as any);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
        new: true,
        runValidators: true,
      });

      expect(result.title).toEqual(book.title);
    });
  });

  //testing deleteById method
  describe('deleteById', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await bookservice.deleteById(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });
  });
});
