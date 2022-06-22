import { Controller, Get, Param, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserInterceptor } from '../user/user.interceptor';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { GalleryService } from '../gallery/gallery.service';
import { Category } from '../gallery/category.enum';
import * as fs from 'fs';
import * as path from 'path';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { AdsService } from '../ads/ads.service';
import { CarService } from '../car/car.service';
import { LocationService } from '../location/location.service';
import { Colors } from '../ads/color.enum';
import { Category as BlogCategory } from '../blog/category.enum';
import { BlogService } from '../blog/blog.service';

interface Role {
  role: { id: number; title: string; }
}

@Controller('my')
@UseInterceptors(UserInterceptor)
@UseGuards(CheckAuthGuard)
export class CabinetController {
  constructor(
    private galleryService: GalleryService,
    private userService: UserService,
    private adsService: AdsService,
    private carService: CarService,
    private locationService: LocationService,
    private blogService: BlogService,
  ) { }

  @Get()
  getMyPage(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    } else {
      return res.redirect('/');
    }

    return res.render(
      'my',
      { user: req.user, title: 'Мои данные' },
    );
  }

  @Get('cabinet')
  getCabinetPage(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }
    const { role } = req.user as User;

    return res.render(
      'cabinet/index',
      { user: req.user, title: 'Мой кабинет' },
    );
  }

  @Get('cabinet/profile')
  getProfilePage(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    return res.render(
      'cabinet/profile',
      { user: req.user, title: 'Редактирование пользователя' },
    );
  }

  @Get('cabinet/ads')
  async getCabinetAdsPage(@Query() query, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const { id } = req.user as User;

    switch (query.cat) {
      case 'autos':

      default:
        const ads = {
          autos: [],
          parts: [],
          count: 0,
        };
        const adsAutosData = await this.adsService.getUserAdsAutos(id, query.page, query.limit);
        const adsPartsData = await this.adsService.getUserAdsParts(id, query.page, query.limit);
        ads.count += adsAutosData.count;
        ads.count += adsPartsData.count;

        adsAutosData.rows.forEach(ad => ads.autos.push(ad));
        adsPartsData.rows.forEach(ad => ads.parts.push(ad));

        return res.render(
          'cabinet/ads',
          { user: req.user, title: 'Мои объявления', ads },
        );
    }
  }

  @Get('cabinet/ads/add')
  async getCabinetAdsAddPage(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const categories = await this.adsService.getCategories();

    return res.render(
      'cabinet/adsAdd',
      { user: req.user, title: 'Новое объявление - Выбор категории', categories: categories },
    );
  }

  @Get('cabinet/ads/add/:name')
  async getCabinetAdsAddItemPage(@Param() params, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const locationsData = await this.locationService.getRegions();
    const { id } = req.user as User;
    const contactsData = await this.userService.getContacts(id);

    var brandsData = await this.carService.getBrands();

    return res.render(
      `cabinet/ads/${params.name}`,
      { user: req.user, title: 'Новое объявление', locations: locationsData, brands: brandsData, contacts: contactsData },
    );
  }

  @Get('cabinet/ads/edit/:id-?:car?')
  async getCabinetAdsEdit(@Param() params, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const locationsData = await this.locationService.getRegions();
    const { id } = req.user as User;
    const contactsData = await this.userService.getContacts(id);
    const brandsData = await this.carService.getBrands();
    const adData = await this.adsService.findOne(params.id, params.car);
    const cities = await this.locationService.getCities(adData.location.region);
    const photos = [];
    let directoryPath: string;
    if (params.car) {
      directoryPath = path.join(process.cwd(), 'uploads', 'ads', `${params.id}-${params.car}`);
    } else {
      directoryPath = path.join(process.cwd(), 'uploads', 'ads', `${params.id}`);
    }

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }

      files.forEach(function (file) {
        photos.push(file);
      });
    });

    return res.render(
      params.car ? 'cabinet/ads/autoEdit' : 'cabinet/ads/partEdit',
      {
        user: req.user, title: 'Редактирование объявления', ad: adData, photos,
        locations: locationsData, brands: brandsData, contacts: contactsData, cities,
        colors: Colors
      },
    );
  }

  @Get('cabinet/ads/contact')
  async getCabinetContactEditPage(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const { id } = req.user as User;
    const contactData = await this.userService.getContacts(id);

    return res.render(
      'cabinet/adsEditContact',
      { user: req.user, title: 'Редактирование контактных данных', contact: contactData },
    );
  }

  @Get('cabinet/blog')
  async getCabinetBlogPage(@Query() query, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const { id } = req.user as User;

    const postsData = await this.blogService.findUserPosts(id);

    return res.render(
      'cabinet/blog',
      { user: req.user, title: 'Мои записи', posts: postsData, categories: BlogCategory },
    );
  }

  @Get('cabinet/blog/add')
  async getCabinetBlogAddPage(@Query() query, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const { id } = req.user as User;

    return res.render(
      'cabinet/blogAdd',
      { user: req.user, title: 'Новая запись' },
    );
  }

  @Get('cabinet/blog/:id/edit')
  async getCabinetBlogEditPage(@Param() params, @Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.redirect('/enter');
    }

    const { id } = req.user as User;

    const postData = await this.blogService.findOne(params.id);

    return res.render(
        'cabinet/blogEdit',
        { user: req.user, title: 'Редактирование записи', post: postData, categories: BlogCategory },
    );
  }

  @Get('cabinet/gallery')
  async getCabinetGalleryPage(@Req() req: Request, @Res() res: Response) {
    let categories = [];
    const { role } = req.user as Role;

    if (!role) {
      return res.redirect('/enter');
    } else if (role.id < 2) {
      return res.redirect('/my/cabinet');
    }

    for (let key in Category) {
      let value = Category[key];
      categories.push(value);
    }

    const albums = await this.galleryService.findAll();

    return res.render(
      'cabinet/gallery',
      { user: req.user, title: 'Фотогалереи', categories, albums },
    );
  }

  @Get('cabinet/gallery/add')
  getCabinetGalleryAddPage(@Req() req: Request, @Res() res: Response) {
    let categories = [];
    const { role } = req.user as Role;

    if (!role) {
      return res.redirect('/enter');
    } else if (role.id < 2) {
      return res.redirect('/my/cabinet');
    }

    for (let key in Category) {
      let value = Category[key];
      categories.push(value);
    }

    return res.render(
      'cabinet/galleryAddAlbum',
      { user: req.user, title: 'Создание альбома', categories },
    );
  }

  @Get('cabinet/gallery/:id/edit')
  async getCabinetGalleryEditPage(@Param() params, @Req() req: Request, @Res() res: Response) {
    const { role } = req.user as Role;

    if (!role) {
      return res.redirect('/enter');
    } else if (role.id < 2) {
      return res.redirect('/my/cabinet');
    }

    let categories = [];
    const albumData = await this.galleryService.findOne(params.id);

    for (let key in Category) {
      let value = Category[key];
      categories.push(value);
    }

    return res.render(
      'cabinet/galleryEditAlbum',
      { user: req.user, title: 'Изменение альбома', categories, album: albumData },
    );
  }

  @Get('cabinet/gallery/:id/add')
  async getCabinetPhotosAddPage(@Param() params, @Req() req: Request, @Res() res: Response) {
    const { role } = req.user as Role;

    if (!role) {
      return res.redirect('/enter');
    } else if (role.id < 2) {
      return res.redirect('/my/cabinet');
    }

    const photos = [];
    const directoryPath = path.join(process.cwd(), 'uploads', 'gallery', params.id);

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }

      files.forEach(function (file) {
        photos.push(file);
      });
    });

    return res.render(
      'cabinet/galleryAddPhotos',
      { user: req.user, title: 'Загрузка фото', id: params.id, photos },
    );
  }
}
