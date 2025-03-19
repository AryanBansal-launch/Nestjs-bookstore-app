import { Controller, Post,Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDTO } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(@Body() userdetail:signupDTO):Promise<{token:string}>{
        return this.authService.signUp(userdetail);
    }
}
