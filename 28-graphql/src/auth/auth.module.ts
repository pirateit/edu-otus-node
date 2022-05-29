import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule, PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '24h' },
    })],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver]
})
export class AuthModule {}
