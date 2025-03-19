import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

console.log("DB url is:",process.env.MONGODB_URL);//env file variables are accessible here
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),MongooseModule.forRoot("mongodb+srv://Bansal29:Bansal%4029@cluster0.findv.mongodb.net/"),BookModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

