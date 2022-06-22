import { BadRequestException, Body, Controller, Req, Get, Post, UseInterceptors, UseGuards, Res, Put } from '@nestjs/common';
import { Response, Request } from 'express';
import {AnyFilesInterceptor, FileInterceptor} from '@nestjs/platform-express';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { UserService } from './user.service';
import { User } from './user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {diskStorage} from "multer";

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
  @Put('api/users/:id')
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/users/avatars',
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async updateUser(@Req() req: Request, @Body() body): Promise<boolean> {
    const { id } = req.user as User;

    if (!body.phone) throw new BadRequestException("Не заполнено поле Номер телефона");

    for (let key in body) {
      if (!body[key]) delete body[key];
    }

    if (body.phone) {
      body.phone = Number('7' + body.phone.replace(/[\+\s()-]/g, '').slice(-10));
    }

    await this.userService.update(id, body)

    return true;
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
