import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/utils/decorators';
import { RtGuard } from 'src/utils/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  singup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.singup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body() { refreshToken }): Promise<Tokens> {
    return this.authService.getRefreshTokens(refreshToken);
  }
}
