import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule,BookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
