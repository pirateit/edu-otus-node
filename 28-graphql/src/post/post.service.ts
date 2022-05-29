import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/user.model';
import { Post } from './post.model';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postModel.findAll();
  }

  findAllByUser(userId: number): Promise<Post[]> {
    return this.postModel.findAll({ where: { author_id: userId } });
  }

  findOneById(postId: number): Promise<Post> {
    return this.postModel.findByPk(postId);
  }

  async create(postData): Promise<boolean>  {
    await this.postModel.create(postData);

    return true;
  }

  async update(postId: number, newPostData): Promise<boolean> {
    await this.postModel.update(newPostData, { where: { id: postId } });

    return true;
  }

  async delete(postId: number): Promise<boolean> {
    await this.postModel.destroy({ where: { id: postId } });

    return true;
  }
}
