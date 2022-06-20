import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { HasMany } from "sequelize-typescript";
import {BlogPost} from "./post.model";

@Table({ tableName: 'blog_comment' })
export class BlogComment extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(255))
  content: string;

  @ForeignKey(() => BlogPost)
  @Column
  post_id: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  author_id: number;

  @ForeignKey(() => BlogComment)
  @Column
  parent_id: number

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  author: User

  @HasMany(() => BlogComment)
  replies: BlogComment
}
