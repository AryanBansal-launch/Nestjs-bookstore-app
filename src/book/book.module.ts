import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './schemas/book.schema';
import { CloudinaryService } from './cloudinary/cloudinary.provider';

@Module({
  imports: [AuthModule,MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }])],
  controllers: [BookController],
  providers: [BookService,CloudinaryService]
})
export class BookModule {}
