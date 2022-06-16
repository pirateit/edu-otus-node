import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CheckAuthGuard } from './auth/check-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(CheckAuthGuard)
  @Get('/')
  @Render('index')
  root(@Req() req) {
    return { user: req.user, title: 'Авто клуб' };
  }
}
