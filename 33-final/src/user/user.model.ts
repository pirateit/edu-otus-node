import { AllowNull, AutoIncrement, BeforeCreate, BeforeUpdate, Column, CreatedAt, DataType, Default, HasMany, Is, IsEmail, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Album } from '../gallery/album.model';
import { Contact } from './contact.model';

@Table({ tableName: 'user', updatedAt: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Unique
  @IsEmail
  @Column(DataType.STRING(255))
  email: string;

  @Column(DataType.STRING(55))
  first_name: string;

  @Column(DataType.STRING(55))
  last_name: string;

  @Unique
  @Is('PhoneNumber', (value) => {
    if (typeof value !== 'bigint' && value.length !== 11) {
      throw new Error('Некорректный формат телефонного номера')
    }
  })
  @Column(DataType.BIGINT)
  phone: number;

  @AllowNull(false)
  @Default(0)
  @Column
  points: number;

  @AllowNull(false)
  @Default(0)
  @Column
  rating: number;

  @Default(0)
  @Column
  role: number;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Default(false)
  @Column
  is_active: boolean;

  @CreatedAt
  created_at: Date;

  @HasMany(() => Album)
  albums: Album[]

  @HasMany(() => Contact)
  contacts: Contact[]

  @BeforeUpdate
  @BeforeCreate
  static async before(instance: User) {
    if (instance.password) {
      const saltOrRounds = 10;
      instance.password = await bcrypt.hash(instance.password, saltOrRounds);
    }

    if (instance.email) {
      instance.email = instance.email.toLocaleLowerCase();
    }

    if (instance.phone) {
      instance.phone = Number(instance.phone);
    }
  }
}
