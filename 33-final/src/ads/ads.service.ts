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
import { AdsCarPart } from "./models/carPart.model";

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Category)
    private categoryModel: typeof Category,
    @InjectModel(AdsAuto)
    private adsAutoModel: typeof AdsAuto,
    @InjectModel(AdsPart)
    private adsPartModel: typeof AdsPart,
    @InjectModel(AdsCarPart)
    private carPartModel: typeof AdsCarPart,
  ) { }

  getCategories(parentId: number | null = null): Promise<Category[]> {
    return this.categoryModel.findAll({
      where: {
        parent_id: parentId
      },
      order: [['title', 'ASC']]
    });
  }

  getUserAdsAutos(userId: number, page = 1, limit = 5): Promise<any> {
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

  getUserAdsParts(userId: number, page = 1, limit = 5): Promise<any> {
    return this.adsPartModel.findAndCountAll({
      where: {
        user_id: userId
      },
      include: [Category, Location, Car, Contact],
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });
  }

  getAdsAutos(filters?, page = 1, limit = 5): Promise<any> {
    let carWhere: any = {};

    if (filters?.car?.model) {
      carWhere = { model: filters.car.model };
    } else if (filters?.car?.brand) {
      carWhere = { brand: filters.car.brand };
    }

    return this.adsAutoModel.findAndCountAll({
      where: {
        // TODO: change maximum price
        price: { [Op.between]: [filters?.price?.from ?? 0, filters?.price?.to ?? 2147483647] },
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

  getAdsParts(filters?, page = 1, limit = 5): Promise<AdsPart[]> {
    let carWhere: any = {};

    if (filters?.car.model) {
      carWhere = { model: filters.car.id };
    } else if (filters?.car.brand) {
      carWhere = { brand: filters.car.brand };
    }

    return this.adsPartModel.findAll({
      where: {
        title: {  [Op.iLike]:  `%${filters?.keywords?.join('%') ?? ''}%` },
        // TODO: change maximum price
        price: { [Op.between]: [filters?.price.from ?? 0, filters?.price.to ?? 2147483647] },
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

  findOne(id: number, car?: number): Promise<AdsAuto | AdsPart> {
    if (car) {
      return this.adsAutoModel.findByPk(id, {
        include: [Car, User, Contact, Location],
      });
    } else {
      return this.adsPartModel.findByPk(id, {
        include: [Car, User, Contact, Location],
      });
    }
  }

  createCarPart(carId: number, adId: number): Promise<any> {
    return this.carPartModel.create({ car_id: carId, ad_id: adId });
  }

  deletePartCars(adId: number): Promise<any> {
    return this.carPartModel.destroy({ where: { ad_id: adId } });
  }

  autos(data: any, t?): Promise<AdsAuto> {
    return this.adsAutoModel.create(data, { transaction: t });
  }

  updateOne(id: number, data: any, car?: number, t?): Promise<any> {
    if (car) {
      return this.adsAutoModel.update(data, { where: { id: id }, transaction: t });
    } else {
      return this.adsPartModel.update(data, { where: { id: id }, transaction: t });
    }
  }

  engine(data: any): Promise<AdsPart> {
    return this.adsPartModel.create(data);
  }

  closeAd(id, car?): Promise<any> {
    if (car) {
      return this.adsAutoModel.update({ is_active: false }, { where: { id: id } });
    } else {
      return this.adsPartModel.update({ is_active: false }, { where: { id: id } });
    }
  }

  openAd(id, car?): Promise<any> {
    if (car) {
      return this.adsAutoModel.update({ is_active: true }, { where: { id: id } });
    } else {
      return this.adsPartModel.update({ is_active: true }, { where: { id: id } });
    }
  }
}
