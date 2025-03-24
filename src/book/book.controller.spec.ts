import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/book.schema';
import { PassportModule } from '@nestjs/passport';
import { User } from 'src/auth/schemas/user.schema';


describe('BookController', () => {

  //mocking the services/providers
  let bookService: BookService;
  let bookcontroller: BookController;

  const mockBook = {
    _id: '61c0ccf11d7bf83d153d7c06',
    user: '61c0ccf11d7bf83d153d7c06',
    title: 'New Book',
    description: 'Book Description',
    author: 'Author',
    price: 100,
    category: Category.FANTASY,
  };

  const mockUser = {
    _id: '61c0ccf11d7bf83d153d7c06',
    name: 'Ghulam',
    email: 'ghulam1@gmail.com',
  };

  const mockBookService = {
    findAll: jest.fn().mockResolvedValueOnce([mockBook]),
    create: jest.fn(),
    findById: jest.fn().mockResolvedValueOnce(mockBook),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookcontroller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(BookController).toBeDefined();
  });

  describe('getAllBooks',()=>{
    //scenerio when all books are returned
    it('should return all books',async ()=>{
      const result=await bookcontroller.getAllBooks();
      expect(bookService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    })
  });

  describe('createBook', () => {
    //scenerio when book is created successfully
    it('should create a new book', async () => {
      const newBook = {
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
      };

      mockBookService.create = jest.fn().mockResolvedValueOnce(mockBook);

      const result = await bookcontroller.createBook(
        newBook as CreateBookDto,
        mockUser as unknown as User,
      );

      expect(bookService.create).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('getBookById',()=>{
    //scenerio when book is returned by id
    it('should return book by id',async ()=>{
      const result=await bookcontroller.getBookById(mockBook._id);
      expect(bookService.findById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    })
  });

  describe('updateBook', () => {
    it('should update book by its ID', async () => {
      const updatedBook = { ...mockBook, title: 'Updated name' };
      const book = { title: 'Updated name' };

      mockBookService.updateById = jest.fn().mockResolvedValueOnce(updatedBook);

      const result = await bookcontroller.updateBook(
        mockBook._id,
        book as UpdateBookDto,
      );

      expect(bookService.updateById).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });
  
  describe('deleteBook', () => {
    it('should delete book by its ID', async () => {
      mockBookService.deleteById = jest.fn().mockResolvedValueOnce(mockBook);

      const result = await bookcontroller.deleteBook(
        mockBook._id,
      );

      expect(bookService.deleteById).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
});
