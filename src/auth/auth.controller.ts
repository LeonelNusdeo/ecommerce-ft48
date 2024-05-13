import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './auth.dto';
import { CreateUserDto } from '../users/users.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Get()
    getAuth() {
        return this.authService.getAuth();
    }

    @Post('signin')
    signIn(@Body() credentials: LoginUserDto) {
        const { email, password } = credentials;
        return this.authService.signIn(email, password);
    }

    @Post('signup')
    signUp(@Body() user: CreateUserDto) {
        return this.authService.signUp(user);
    }
}
