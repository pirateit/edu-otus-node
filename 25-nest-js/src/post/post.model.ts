import { AllowNull, BelongsTo, Column, CreatedAt, ForeignKey, Length, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'post' })
export class Post extends Model {
  @Length({ max: 255 })
  @AllowNull(false)
  @Column
  title: string;

  @Length({ max: 25000 })
  @AllowNull(false)
  @Column
  content: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  author_id: number

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  author: User
}
