import { Prop, Schema } from "@nestjs/mongoose";
import { SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})

export class User{
    @Prop()
    username: string;
    @Prop({unique:[true,'Email already exists']})
    email: string;
    @Prop()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);