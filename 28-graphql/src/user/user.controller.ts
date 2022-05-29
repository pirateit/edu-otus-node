import { Controller, Request, Get, UseGuards, Put, Body, HttpCode, Param, ForbiddenException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(GqlAuthGuard)
  @Put(':id')
  @HttpCode(204)
  updateUser(@Param() params, @Body() body, @Request() req) {
    if (Number(params.id) !== req.user.id) throw new ForbiddenException();

    this.userService.update(Number(params.id), body);
  }
}
