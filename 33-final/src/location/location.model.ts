import { AllowNull, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'location', timestamps: false })
export class Location extends Model {
  @AllowNull(false)
  @Column(DataType.STRING(55))
  region: string;

  @Column(DataType.STRING(55))
  city: string;

  
}
