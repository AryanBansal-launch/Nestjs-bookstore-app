import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book, Category } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { mock } from 'node:test';
import { BadRequestException,NotFoundException } from '@nestjs/common';

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

  //we need to mock the services/methods, as we do not actually call to DB's
  const mockBookService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
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
});
