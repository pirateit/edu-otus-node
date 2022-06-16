import { AllowNull, BelongsTo, Column, CreatedAt, DataType, Default,  ForeignKey,  HasOne,  Model, Table, UpdatedAt } from 'sequelize-typescript';
import { Contact } from '../../user/contact.model';
import { Location } from '../../location/location.model';
import { Car } from '../../car/car.model';
import { User } from '../../user/user.model';
import { Category } from '../category.model';

@Table({ tableName: 'ads_auto' })
export class AdsAuto extends Model {
  @ForeignKey(() => Category)
  @AllowNull(false)
  @Default(1)
  @Column
  category_id: number;

  @ForeignKey(() => Car)
  @AllowNull(false)
  @Column
  car_id: number;

  @AllowNull(false)
  @Column
  is_owner: boolean;

  @Column
  color: number;

  @AllowNull(false)
  @Column
  year: number;

  @Column
  body_type: number;

  @AllowNull(false)
  @Column
  drive: number;

  @AllowNull(false)
  @Column
  engine_type: number;

  @Column(DataType.REAL)
  engine_capacity: number;

  @AllowNull(false)
  @Column
  transmission: number;

  @Column
  mileage: number;

  @Column
  state: number;

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

  @BelongsTo(() => Car)
  car: Car

  @BelongsTo(() => User)
  user: User

  // TODO: Add additional options
}
