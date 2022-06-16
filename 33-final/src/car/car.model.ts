import { AllowNull, BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { AdsPart } from '../ads/models/part.model';
import { AdsAuto } from '../ads/models/auto.model';
import { AdsCarPart } from '../ads/models/carPart';

@Table({ tableName: 'car', timestamps: false })
export class Car extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(55))
  brand: string;

  @AllowNull(false)
  @Column(DataType.STRING(55))
  model: string;

  @Column(DataType.STRING(55))
  generation: string;

  @Column
  description: string;

  @HasMany(() => AdsAuto)
  players: AdsAuto[]

  @BelongsToMany(() => AdsPart, () => AdsCarPart)
  parts: AdsPart[]
}
