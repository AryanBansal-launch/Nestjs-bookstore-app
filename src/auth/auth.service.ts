import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { signupDTO } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService:JwtService) {}

    async signUp(userdetail:signupDTO):Promise<{token:string}>{
        const {name,email,password} = userdetail;
        const hashedPassword = await bcrypt.hash(password,10);

        const newuser=await this.userModel.create({name,email,password:hashedPassword});

        //genearting jwt token on signup
        const token=this.jwtService.sign({_id:newuser._id});
        return {token};
    }
}
