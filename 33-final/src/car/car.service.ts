import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from './car.model';
import {Op} from "sequelize";

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car)
    private carModel: typeof Car,
  ) { }

  getBrands(): Promise<Car[]> {
    return this.carModel.findAll({
      attributes: ['brand'],
      group: 'brand',
      order: [['brand', 'ASC']]
    });
  }

  getModels(brandName: string): Promise<Car[]> {
    return this.carModel.findAll({
      where: { brand: brandName, generation: null },
      attributes: ['id', 'model'],
      // group: 'model',
      order: [['model', 'ASC']]
    });
  }

  getGenerations(modelName: string): Promise<Car[]> {
    return this.carModel.findAll({
      where: { brand: modelName },
      order: [['generation', 'ASC']]
    });
  }
}
