import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'album' })
export class Album extends Model {
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @Column(DataType.STRING(255))
  description: number;

  @Column(DataType.DATEONLY)
  event_date: string;

  // @Column
  // event_id: number;

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
  @Column
  category: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  author: User
}
