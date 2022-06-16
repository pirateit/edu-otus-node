import { AllowNull, BeforeCreate, BeforeUpdate, BelongsTo, Column, CreatedAt, DataType, Default, ForeignKey, Is, IsEmail, Model, Table, Unique, UpdatedAt } from 'sequelize-typescript';
import { User } from '../user/user.model';

@Table({ tableName: 'user_contact' })
export class Contact extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(55))
  name: string;

  @Unique
  @Is('PhoneNumber', (value) => {
    if (typeof value !== 'number' && value.length !== 11) {
      throw new Error('Некорректный формат телефонного номера')
    }
  })
  @Column(DataType.BIGINT)
  phone: number;

  @Unique
  @IsEmail
  @Column(DataType.STRING(255))
  email: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => User)
  user: User

  @BeforeUpdate
  @BeforeCreate
  static before(instance: User) {
    if (instance.email) {
      instance.email = instance.email.toLocaleLowerCase();
    }

    if (instance.phone) {
      instance.phone = Number(instance.phone);
    }
  }
}
