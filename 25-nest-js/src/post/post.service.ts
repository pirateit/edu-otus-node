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
    return this.postModel.findAll({
      include: {
        model: User,
        attributes: ['id', 'email']
      }
    });
  }

  findOneById(postId: number): Promise<Post> {
    return this.postModel.findByPk(postId, {
      include: {
        model: User,
        attributes: ['id', 'email']
      }
    });
  }

  create(postData): void {
    this.postModel.create(postData);
  }

  update(postId: number, newPostData: Post): void {
    this.postModel.update(newPostData, { where: { id: postId } });
  }

  delete(postId: number): void {
    this.postModel.destroy({ where:  { id: postId } });
  }
}
