import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@app/auth';
import { UseCookie } from '@app/auth/interceptor/cookie.interceptor';
import { loginResponseDto } from '@app/auth/dto/responseDto/loginResponse.dto';
import { LoginDto } from '@app/auth/dto/requestDto/login.dto';
import { CreateUserDto } from '@app/auth/dto/requestDto/create.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '@app/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseCookie(loginResponseDto, 'token', 60 * 60 * 15)
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Delete('logout')
  logout(@Res({passthrough: true}) res: Response, @Req() req: Request) {
    const token = req.signedCookies['token'];
    if (!token) {
      return { message: 'No token found' };
    }
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // true in production
      sameSite: 'strict',
      path: '/',
      signed: true,
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Put('update-profile')
  updateProfile(@Body() body: any, @Req() req: Request) {
    return this.authService.updateProfile(body, req);
  }
}
