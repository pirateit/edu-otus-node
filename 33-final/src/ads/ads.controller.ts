import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdsService } from './ads.service';
import * as fs from 'fs';
import { join } from 'path';
import { LocationService } from '../location/location.service';
import { Sequelize } from 'sequelize-typescript';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { CarService } from '../car/car.service';
import { EngineTypes } from '../car/engine-type.enum';
import { Transmissions } from '../car/transmission.enum';
import { Drives } from '../car/drive.enum';
import { Colors } from './color.enum';
import { BodyTypes } from '../car/body-type.enum';
import { States } from './state.enum';
import * as path from 'path';

@Controller()
export class AdsController {
  constructor(
    private sequelize: Sequelize,
    private adsService: AdsService,
    private locationService: LocationService,
    private carService: CarService,
  ) { }

  @UseGuards(CheckAuthGuard)
  @Get('ads')
  async getAds(@Param() params, @Req() req, @Res() res) {
    // TODO: Show NEW ads
    // const adsAutosData = await this.adsService.getAdsAutos();
    // const adsPartsData = await this.adsService.getAdsParts();
    // const ads = {
    //   autos: [],
    //   parts: [],
    // };

    // adsAutosData.forEach(ad => ads.autos.push(ad));
    // adsPartsData.forEach(ad => ads.parts.push(ad));

    return res.render(
      'ads',
      { user: req.user, title: 'Объявления' },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('ads/autos')
  async getAdsAutos(@Query() query, @Req() req, @Res() res) {
    const brandsData = await this.carService.getBrands();

    if (query) {
      var filters: any = {};

      for (let key in query) {
        if (!query[key]) delete query[key];
      }

      for (let key in query) {
        if (!query[key]) {
          delete query[key];
        } else {
          switch (key) {
            case 'brand':
            case 'model':
              if (key === 'model') {
                filters.car = {};
                filters.car.model = query[key];
              } else if (key === 'brand' || query.model == '') {
                filters.car = {};
                filters.car.brand = query[key];
              }
              break;
            case 'priceFrom':
              filters.price = {};
              filters.price.from = Number(query[key]);
              break;
            case 'priceTo':
              filters.price = {};
              filters.price.to = Number(query[key]);
              break;
            case 'yearFrom':
              filters.year = {};
              filters.year.from = Number(query[key]);
              break;
            case 'yearTo':
              filters.year = {};
              filters.year.to = Number(query[key]);
              break;
            case 'state':
              filters.state = Number(query[key]);
              break;
            case 'transmission':
              filters.transmission = Number(query[key]);
              break;
            case 'engineType':
              filters.engineType = Number(query[key]);
              break;
            default:
              break;
          }
        }
      }
    }

    const adsAutosData = await this.adsService.getAdsAutos(filters, query.page, query.limit);
    filters.total = adsAutosData.count;
    filters.page = query.page ?? 1;
    filters.totalPages = filters.total < (Number(query.limit) || 5) ? 1 : Math.ceil(filters.total / (Number(query.limit) || 5));


    return res.render(
      'adsAutos',
      { user: req.user, title: 'Объявления о продаже авто', ads: adsAutosData.rows, brands: brandsData, engineTypes: EngineTypes, transmissions: Transmissions, drives: Drives,
      filters: Object.keys(filters).length === 0 ? null : filters, },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('ads/parts')
  async getAdsParts(@Query() query, @Req() req, @Res() res) {
    const brandsData = await this.carService.getBrands();

    if (query) {
      var filters: any = { car: {}, price: {} };

      for (let key in query) {
        if (!query[key]) delete query[key];
      }

      for (let key in query) {
        if (!query[key]) {
          delete query[key];
        } else {
          switch (key) {
            case 'brand':
              case 'model':
                if (key === 'model') {
                  filters.car.id = query[key];
                } else if (key === 'brand' || query.model == '') {
                  filters.car.brand = query[key];
                }
                break;
            case 'priceFrom':
              filters.price.from = Number(query[key]);
              break;
            case 'priceTo':
              filters.price.to = Number(query[key]);
              break;
              case 'keywords':
                const keywords = query.keywords.split(' ');

                filters.keywords = keywords;
                break;
            default:
              break;
          }
        }
      }
    }

    const adsPartsData = await this.adsService.getAdsParts(filters, query.page);

    return res.render(
      'adsParts',
      { user: req.user, title: 'Объявления о продаже авто', ads: adsPartsData, brands: brandsData },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('ads/autos/:id-:car')
  async getAdsAuto(@Param() params, @Req() req, @Res() res) {
    const adData = await this.adsService.findOne(Number(params.id), Number(params.car));
    const photos = [];
    const directoryPath = path.join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`);

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }

      files.forEach(function (file) {
        photos.push(file);
      });
    });

    return res.render(
      'adsAuto',
      { user: req.user, title: 'Объявления о продаже авто',
      ad: adData,
      photos,
      colors: Colors,
      engineTypes: EngineTypes,
      transmissions: Transmissions,
      drives: Drives,
      bodyTypes: BodyTypes,
    states: States, },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('ads/parts/:id')
  async getAdsPart(@Param() params, @Req() req, @Res() res) {
    const adData = await this.adsService.findOne(Number(params.id));
    const photos = [];
    const directoryPath = path.join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`);

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }

      files.forEach(function (file) {
        photos.push(file);
      });
    });

    return res.render(
      'adsPart',
      { user: req.user, title: 'Объявления о продаже запчасти',
      ad: adData,
      photos,
      colors: Colors,
      engineTypes: EngineTypes,
      transmissions: Transmissions,
      drives: Drives,
      bodyTypes: BodyTypes,
    states: States, },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/ads/category/:id')
  async getCategory(@Param() params) {
    const categoriesData = await this.adsService.getCategories(params.id);
    const categories = categoriesData.map(cat => {
      return {
        id: cat.id,
        title: cat.title,
        template_name: cat.template_name
      };
    });

    return categories;
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/ads')
  @UseInterceptors(FilesInterceptor('photos', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, `./uploads/ads/temp`)
      },
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createAd(@Body() body, @Req() req) {
    if (body.city) {
      body.location_id = body.city;
    } else {
      const locationData = await this.locationService.findRegionByName(body.region);
      body.location_id = locationData.id;
    }

    for (let key in req.body) {
      if (!req.body[key]) req.body[key] = null;
    }

    if (body.model) body.car_id = body.model;
    if (body.type === 'parts') body.category
    switch (body.type) {
      case 'autos':
        body.category_id = 1;
        break;
      case 'engine':
        body.category_id = 3;
        break;
      case 'chassis':
        body.category_id = 4;
        break;
      case 'body':
        body.category_id = 5;
        break;
      case 'electric':
        body.category_id = 6;
        break;
      default:
        body.category_id = 2;
    }

    body.user_id = req.user.id;
    req.files ? body.photo = req.files[0]?.filename : false;

    try {
      const result = await this.sequelize.transaction(async t => {
        const newAdData = await this.adsService[body.type](body, t);
        if (body.cars && typeof body.cars === 'string') {
          await this.adsService.createCarPart(body.car, newAdData.id);
        } else if (body.cars) {
          body.cars.forEach(async car => await this.adsService.createCarPart(body.car, newAdData.id));
        }

        if (req.files) {
          if (body.type === 'autos') {
            if (!fs.existsSync(join(process.cwd(), 'uploads', 'ads', `${newAdData.id}-${body.car_id}`))) {
              fs.mkdirSync(join(process.cwd(), 'uploads', 'ads', `${newAdData.id}-${body.car_id}`));
            }
          } else {
            if (!fs.existsSync(join(process.cwd(), 'uploads', 'ads', `${newAdData.id}`))) {
              fs.mkdirSync(join(process.cwd(), 'uploads', 'ads', `${newAdData.id}`));
            }
          }

          req.files.forEach(file => {
            var newPath: string;

            if (body.type === 'autos') {
              newPath = join(process.cwd(), 'uploads', 'ads', `${newAdData.id}-${body.car_id}`, file.filename);
            } else {
              newPath = join(process.cwd(), 'uploads', 'ads', `${newAdData.id}`, file.filename);
            }

            fs.rename(file.path, newPath, function (err) {
              if (err) throw err;
            })
          });
        }

        return newAdData;
      });
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Put('api/ads/:id-?:car?')
  @UseInterceptors(FilesInterceptor('photos', 10, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const adPath = req.params.car ? `${req.params.id}-${req.params.car}` : `${req.params.id}`;

        cb(null, `./uploads/ads/${adPath}`)
      },
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async editAd(@Param() params, @Body() body, @Req() req) {
    if (body.is_active === false) {
      return this.adsService.closeAd(params.id, params.car);
    } else if (body.is_active === true) {
      return this.adsService.openAd(params.id, params.car);
    }

    if (body.city) {
      body.location_id = body.city;
    } else {
      const locationData = await this.locationService.findRegionByName(body.region);

      body.location_id = locationData.id;
    }

    for (let key in body) {
      if (!body[key]) body[key] = null;
    }

    body.car_id = body.model;
    body.user_id = req.user.id;
    req.files && !body.photo ? body.photo = req.files[0]?.filename : false;

    try {
      const result = await this.sequelize.transaction(async t => {
        await this.adsService.updateOne(params.id, body, params.car, t);
        await this.adsService.deletePartCars(params.id);

        if (body.cars && typeof body.cars === 'string') {
          await this.adsService.createCarPart(body.cars, params.id);
        } else if (body.cars) {
          body.cars.forEach(async car => await this.adsService.createCarPart(car, params.id));
        }

        if (Number(params.car) !== Number(body.model)) {
          const newPath = join(process.cwd(), 'uploads', 'ads', `${params.id}-${body.model}`);

          fs.rename(join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`), newPath, function (err) {
            if (err) throw err;
          });
        }

        if (req.files) {
          if (params.car) {
            if (!fs.existsSync(join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`))) {
              fs.mkdirSync(join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`));
            }
          }
        } else {
          if (!fs.existsSync(join(process.cwd(), 'uploads', 'ads', `${params.id}`))) {
            fs.mkdirSync(join(process.cwd(), 'uploads', 'ads', `${params.id}`));
          }
        }

        if (body.deletePhotos && typeof body.deletePhotos === 'string') {
          if (params.car) {
          fs.unlink(join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`, body.deletePhotos), (err) => {
            if (err) throw err;
          });
          } else {
            fs.unlink(join(process.cwd(), 'uploads', 'ads', `${params.id}`, body.deletePhotos), (err) => {
              if (err) throw err;
            });
          }
        } else if (body.deletePhotos) {
          if (params.car) {
          body.deletePhotos.forEach(photo => fs.unlink(join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`, photo), (err) => {
            if (err) throw err;
          }));
          } else {
            body.deletePhotos.forEach(photo => fs.unlink(join(process.cwd(), 'uploads', 'ads', `${params.id}`, photo), (err) => {
              if (err) throw err;
            }));
          }
        }

        return true;
      });
    } catch (err) {
      console.log(err);

      throw new InternalServerErrorException('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }

    return true;
  }
}

