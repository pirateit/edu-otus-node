import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './post.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostResolver } from './post.resolver';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';

@Module({
  imports: [SequelizeModule.forFeature([Post, User])],
  providers: [PostService, PostResolver, UserService],
  exports: [PostService],
})
export class PostModule {}
