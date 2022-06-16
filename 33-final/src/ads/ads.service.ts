import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contact } from '../user/contact.model';
import { Car } from '../car/car.model';
import { Location } from '../location/location.model';
import { Category } from './category.model';
import { AdsAuto } from './models/auto.model';
import { AdsPart } from './models/part.model';
import { Op } from "sequelize";
import { User } from '../user/user.model';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectModel(AdsAuto)
    private adsAutoModel: typeof AdsAuto,
    @InjectModel(AdsPart)
    private adsPartModel: typeof AdsPart,
  ) { }

  getCategories(parentId: number | null = null): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: {
        parent_id: parentId
      },
      order: [['title', 'ASC']]
    });
  }

  getUserAdsAutos(userId: number, page = 1, limit = 3): Promise<any> {
    return this.adsAutoModel.findAndCountAll({
      where: {
        user_id: userId
      },
      include: [Category, Location, Car, Contact],
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  getAdsAutos(filters?, page = 1, limit = 10): Promise<AdsAuto[]> {
    let carWhere: any = {};

    if (filters?.car.model) {
      carWhere = { model: filters.car.model };
    } else if (filters?.car.brand) {
      carWhere = { brand: filters.car.brand };
    }
    console.log(filters);

    return this.adsAutoModel.findAll({
      where: {
        // TODO: change maximum price
        price: { [Op.between]: [filters?.price.from ?? 0, filters?.price.to ?? 2147483647] },
        year: { [Op.between]: [filters?.year?.from ?? 0, filters?.year?.to ?? 2147483647] },
        state: filters?.state ?? { [Op.or]: [1, 2, null] },
        transmission: filters?.transmission ?? { [Op.or]: [1, 2, 3, 4] },
        engine_type: filters?.engineType ?? { [Op.or]: [1, 2, 3, 4] },
        is_active: true,
      },
      include: [{
        model: Car,
        where: carWhere
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  findAdsAuto(id: number): Promise<AdsAuto> {
    return this.adsAutoModel.findByPk(id, {
      include: [Car, User, Contact, Location],
    });
  }

  getAdsParts(page = 1, limit = 10): Promise<AdsPart[]> {
    return this.adsPartModel.findAll({
      include: [Category, Location],
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  autos(data: any, t?): Promise<AdsAuto> {
    return this.adsAutoModel.create(data, { transaction: t });
  }

  updateAuto(id: number, data: any, t?): Promise<any> {
    return this.adsAutoModel.update(data, { where: { id: id }, transaction: t });
  }

  parts(data: any): Promise<AdsPart> {
    return this.adsPartModel.create(data);
  }

  closeAd(id, car?): Promise<any> {
    if (car) {
      return this.adsAutoModel.update({ is_active: false }, { where: { id: id } });
    } else {

    }
  }

  openAd(id, car?): Promise<any> {
    if (car) {
      return this.adsAutoModel.update({ is_active: true }, { where: { id: id } });
    } else {

    }
  }
}
