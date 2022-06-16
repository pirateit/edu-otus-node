import { AllowNull, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table, Unique } from 'sequelize-typescript';

@Table({ tableName: 'ads_category', timestamps: false })
export class Category extends Model {
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(55))
  title: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(55))
  template_name: string;

  @ForeignKey(() => Category)
  @Column
  parent_id: number;

  // @HasOne(() => Category) 
  // parent: Category

  @HasMany(() => Category)
  childs: Category[]
}
