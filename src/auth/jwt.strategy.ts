import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./schemas/user.schema";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ){
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretorKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload){
    const {id} = payload;
    const user = await this.userModel.findById(id);
    if(!user){
      throw new UnauthorizedException('Please login to access!');
    }
    return user;
  }
}