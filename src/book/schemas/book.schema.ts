
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../auth/schemas/user.schema';
import mongoose from 'mongoose';

export enum Category {
    ACTION='Action',
    DRAMA='Drama',
    THRILLER='Thriller',
    COMEDY='Comedy',
    SCIFI='Sci-Fi',
    ADVENTURE='Adventure',
    FANTASY='Fantasy',
    HORROR='Horror',
    ROMANCE='Romance',
    MYSTERY='Mystery',
    POETRY='Poetry',
    SELF_HELP='Self-Help',
    BIOGRAPHY='Biography',
    HISTORY='History',
    EDUCATION='Education',
    TRAVEL='Travel',
}

@Schema({
    timestamps: true,
})
export class Book {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: Category

  @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
  user: User

  @Prop()
    imageUrl?: string; 
}

export const BookSchema = SchemaFactory.createForClass(Book);
