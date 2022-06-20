import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BlogPost } from './post.model';
import { BlogComment } from './comment.model';
import { User } from '../user/user.model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogPost)
    private postModel: typeof BlogPost,
    @InjectModel(BlogComment)
    private commentModel: typeof BlogComment,
  ) { }

  find(filters: any, page = 1, limit = 5): Promise<any> {
    if (filters.category) var where = { category: filters.category };

    return this.postModel.findAndCountAll({
      include: [User],
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  findOne(postId: number): Promise<BlogPost> {
    return this.postModel.findByPk(postId, {
      include: [User, {
        model: BlogComment,
        include: [User, {
          model: BlogComment,
          include: [User],
        }],
      }],
    });
  }

  create(postData): Promise<BlogPost> {
    return this.postModel.create(postData);
  }

  update(postId: number, postData): Promise<any> {
    return this.postModel.update(postData, { where: { id: postId } });
  }

  findUserPosts(userId: number, page = 1, limit = 5): Promise<BlogPost[]> {
    return this.postModel.findAll({ where: { author_id: userId }, order: [['created_at', 'DESC']] });
  }

  createComment(comment): Promise<BlogComment> {
    console.log(comment)
    return this.commentModel.create(comment);
  }
}
