import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: mongoose.Model<User>) {}
}
