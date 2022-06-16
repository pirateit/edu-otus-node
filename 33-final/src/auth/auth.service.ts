import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmailOrPhone(login);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      // const { password, ...result } = user;
      return user;
    }

    return null;
  }

  async login(user: any): Promise<string> {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload);
  }
}
