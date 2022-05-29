import { AllowNull, BeforeCreate, BeforeUpdate, Column, CreatedAt, Default, HasMany, Length, Model, Table, Unique } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from '../post/post.model';

@Table({ tableName: 'user', updatedAt: false })
export class User extends Model {
  @Unique
  @Length({ max: 255 })
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Default(true)
  @Column
  isActive: boolean;

  @CreatedAt
  created_at: Date;

  @HasMany(() => Post)
  posts: Post[];

  @BeforeUpdate
  @BeforeCreate
  static async before(instance: User) {
    if (instance.password) {
      const saltOrRounds = 10;
      instance.password = await bcrypt.hash(instance.password, saltOrRounds);
    }
    console.log(123);

    if (instance.email) {
      instance.email = instance.email.toLocaleLowerCase();
    }
  }
}
