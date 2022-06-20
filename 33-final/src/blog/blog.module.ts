import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlogPost } from './post.model';
import { BlogComment } from './comment.model';

@Module({
  imports: [SequelizeModule.forFeature([BlogPost, BlogComment])],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [BlogService]
})
export class BlogModule {}
