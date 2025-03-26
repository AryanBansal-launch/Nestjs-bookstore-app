import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { Category } from '../src/book/schemas/book.schema';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // Load environment variables before the tests
  beforeAll(async () => {
    dotenv.config(); // Load environment variables from .env file
    console.log('DB URL is:', process.env.MONGODB_URL); // Ensure the environment variable is loaded

    // Now connect to the MongoDB database before running tests
    const conn = await mongoose.connect(process.env.MONGODB_URL as string);

    // Drop the database to ensure a clean test environment
    // await mongoose.connection.db.dropDatabase();
  });

  // Set up the app for testing
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Disconnect after all tests are done
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // Define the test case
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World from Nest JS!');
  });

  const user = {
    username: 'Aryan',
    email: 'aryan1@gmail.com',
    password: '12345678',
  };

  const newBook = {
    title: 'New Book',
    description: 'Book Description',
    author: 'Author',
    price: 100,
    category: Category.FANTASY,
  };

  let jwtToken: string = '';
  let bookCreated;

  //Tests cases for auth
  describe('Auth', () => {
    //register
    it('(POST) -Register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    //login
    it('(POST) -Login a user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });
  });

  //Test cases for books
  describe('Books', () => {
    //get all books
    it('(GET) - Get all Books', async () => {
      return request(app.getHttpServer())
        .get('/books')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });

    //create a new book
    it('(POST) - Create a new book', async () => {
      return request(app.getHttpServer())
        .post('/books/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newBook)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          bookCreated=res.body;
        });
    });

    it('(GET) - Get a book by ID', async () => {
      return request(app.getHttpServer())
        .get(`/books/${bookCreated?._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toBe(bookCreated?._id);
        });
    });
  });
});
