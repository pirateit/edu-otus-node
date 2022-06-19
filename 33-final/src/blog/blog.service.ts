import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Blog } from './blog.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog)
    private blogModel: typeof Blog,
  ) { }

  create(postData): Promise<Blog> {
    return this.blogModel.create(postData);
  }

  findUserPosts(userId: number): Promise<Blog[]> {
    return this.blogModel.findAll({ where: { author_id: userId } });
  }
}
