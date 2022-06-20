import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { User } from '../user/user.model';
import { HasMany } from "sequelize-typescript";
import { BlogComment } from "./comment.model";

@Table({ tableName: 'blog_post' })
export class BlogPost extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.STRING(5000))
  content: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  author_id: number;

  @AllowNull(false)
  @Default(false)
  @Column
  is_active: boolean;

  @Column
  cover: string;

  @AllowNull(false)
  @Default(1)
  @Column
  category: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  author: User

  @HasMany(() => BlogComment)
  comments: BlogComment
}
