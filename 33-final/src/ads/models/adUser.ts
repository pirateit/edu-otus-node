import { AllowNull, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Car } from '../../car/car.model';
import { AdsPart } from './part.model';

@Table({ tableName: 'ads_part_car', timestamps: false })
export class AdUser extends Model {
  @ForeignKey(() => Car)
  @AllowNull(false)
  @Column
  ad_id: number

  @ForeignKey(() => AdsPart)
  @AllowNull(false)
  @Column
  user_id: number
}
