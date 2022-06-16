import { BadRequestException, Body, Controller, Req, Get, Post, UseInterceptors, UseGuards, Res, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { UserService } from './user.service';
import { User } from './user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(CheckAuthGuard)
  @Get('enter')
  getRegisterPage(@Req() req, @Res() res: Response) {
    if (req.user) {
      return res.redirect('/');
    }

    return res.render(
      'enter',
      { user: req.user, title: 'Вход' },
    );
  }

  @Post('api/users')
  @UseInterceptors(AnyFilesInterceptor())
  createUser(@Body() userData): Boolean {
    if (!userData.email && !userData.phone) throw new BadRequestException("Не заполнено поле Email ИЛИ Номер телефона");

    for (let key in userData) {
      if (!userData[key]) delete userData[key];
    }

    if (userData.phone) {
      userData.phone = '7' + userData.phone.replace(/[\+\s()-]/g, '').slice(-10);
    }

    return this.userService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/users/:id/contact')
  @UseInterceptors(AnyFilesInterceptor())
  updateContact(@Req() req: Request, @Body() contactData): Promise<boolean> {
    const { id } = req.user as User;

    if (!contactData.phone) throw new BadRequestException("Не заполнено поле Номер телефона");

    for (let key in contactData) {
      if (!contactData[key]) delete contactData[key];
    }

    if (contactData.phone) {
      contactData.phone = Number('7' + contactData.phone.replace(/[\+\s()-]/g, '').slice(-10));
    }

    contactData.user_id = id;

    return this.userService.upsertContact(contactData);
  }
}
