import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { signupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService:JwtService) {}

    //signup function
    async signUp(userdetail:signupDTO):Promise<{token:string}>{
        const {username,email,password} = userdetail;
        const hashedPassword = await bcrypt.hash(password,10);

        const newuser=await this.userModel.create({username,email,password:hashedPassword});

        //genearting jwt token on signup
        const token=this.jwtService.sign({_id:newuser._id});
        return {token};
    }
    
    //login function
    async login(usercred:LoginDTO):Promise<{token:string}>{
        const {email,password} = usercred;
        const user = await this.userModel.findOne({email});
        if(!user){
            throw new Error('User not found');
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw new Error('Invalid password');
        }
        //generating jwt token on login
        const token=this.jwtService.sign({_id:user._id});
        return {token};
    }

}
