import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, Default,  ForeignKey,  HasOne,  Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Contact } from '../../user/contact.model';
import { Location } from '../../location/location.model';
import { Car } from '../../car/car.model';
import { User } from '../../user/user.model';
import { Category } from '../category.model';
import { AdsCarPart } from './carPart';

@Table({ tableName: 'ads_part' })
export class AdsPart extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column
  category_id: number;

  @Column
  part_number: number;

  @AllowNull(false)
  @Column(DataType.STRING(5000))
  description: string;

  @ForeignKey(() => Location)
  @AllowNull(false)
  @Column
  location_id: number;

  @ForeignKey(() => Contact)
  @AllowNull(false)
  @Column
  contact_id: number;

  @AllowNull(false)
  @Column
  price: number;

  @Column
  photo: string;

  @AllowNull(false)
  @Default(true)
  @Column
  is_active: boolean;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @BelongsTo(() => Category)
  category: Category

  @BelongsTo(() => Location)
  location: Location

  @BelongsTo(() => Contact)
  contact: Contact

  @BelongsTo(() => User)
  user: User

  @BelongsToMany(() => Car, () => AdsCarPart)
  cars: Car[]
}
