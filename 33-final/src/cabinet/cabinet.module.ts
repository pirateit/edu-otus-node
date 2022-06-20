import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.model';
import { CabinetController } from './cabinet.controller';
import { Album } from '../gallery/album.model';
import { GalleryModule } from '../gallery/gallery.module';
import { AdsModule } from '../ads/ads.module';
import { Car } from '../car/car.model';
import { CarModule } from '../car/car.module';
import { LocationModule } from 'src/location/location.module';
import { BlogModule } from 'src/blog/blog.module';
import { BlogPost } from '../blog/post.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Album, Car, BlogPost]),
  UserModule,
  GalleryModule,
  AdsModule,
  CarModule,
  LocationModule,
  BlogModule,
],
  controllers: [CabinetController]
})
export class CabinetModule {}
