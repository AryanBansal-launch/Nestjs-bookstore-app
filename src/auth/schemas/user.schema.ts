import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default:[Role.User]
  })
  role:Role[]
}

export const UserSchema = SchemaFactory.createForClass(User);
