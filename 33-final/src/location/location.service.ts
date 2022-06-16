import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Location } from './location.model';
import { Op, fn, col } from "sequelize";


@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location)
    private locationModel: typeof Location,
  ) { }

  getRegions(): Promise<Location[]> {
    return this.locationModel.findAll({
      attributes: ['region', [fn('count', col('"region')), 'citiesCount']],
      group: ['region'],
      order: [['region', 'ASC']]
    });
  }

  getCities(region: string): Promise<Location[]> {
    return this.locationModel.findAll({
      where: {
          region: region,
          city: { [Op.ne]: null }
      },
      order: [['city', 'ASC']]
    });
  }

  findRegionByName(region: string): Promise<Location> {
    return this.locationModel.findOne({ where: { region } });
  }
}
