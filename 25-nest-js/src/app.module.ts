import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { Post } from './post/post.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Post],
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
