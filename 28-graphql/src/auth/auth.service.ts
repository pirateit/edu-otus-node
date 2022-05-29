import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UniqueConstraintError } from 'sequelize';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const user = {
      email, password
    }

    try {
      await this.userService.create(user);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException('Данный пользователь уже зарегистрирован')
      } else {
        throw new InternalServerErrorException();
      }
    }

    return true;
  }
}
