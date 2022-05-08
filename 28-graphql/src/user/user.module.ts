import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserResolver } from './user.resolver';
import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Post])],
  providers: [UserService, UserResolver, PostService],
  exports: [UserService],
})
export class UserModule {}
