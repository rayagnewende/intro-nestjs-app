import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './auth.credentials.dto';
import User from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './getUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(
    @Body(ValidationPipe) authCredentials: AuthCredentials,
  ): Promise<User> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentials: AuthCredentials,
  ): Promise<{ accessToken: string }> {
    return this.authService.validateUserPassword(authCredentials);
  }
}
