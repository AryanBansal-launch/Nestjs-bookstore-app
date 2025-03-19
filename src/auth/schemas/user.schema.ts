import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({   
    timestamps: true,
})

export class User extends Document{
    @Prop()
    username: string;
    @Prop({unique:[true,'Email already exists']})
    email: string;
    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);