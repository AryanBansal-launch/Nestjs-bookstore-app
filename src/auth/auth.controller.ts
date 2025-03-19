import { Controller, Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() userdetail:signupDTO):Promise<{token:string}>{
        return this.authService.signUp(userdetail);
    }

    @Post('login')
    async login(@Body() userdetail:LoginDTO):Promise<{token:string}>{
        return this.authService.login(userdetail);
    }
}
