import {Controller, Get, Post, Request, Res, UseGuards} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {CheckAuthGuard} from "./check-auth.guard";

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const accessToken = await this.authService.login(req.user);

    response.cookie('access_token', accessToken);
    // return response.json({ 'access_token': accessToken });
  }

  @UseGuards(CheckAuthGuard)
  @Get('logout')
  async logout(@Request() req, @Res() response: Response) {
    return response.clearCookie('access_token').redirect('/');
    // return response.json({ 'access_token': accessToken });
  }
}
