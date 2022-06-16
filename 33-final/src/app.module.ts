import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GalleryModule } from './gallery/gallery.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { CabinetModule } from './cabinet/cabinet.module';
import { Album } from './gallery/album.model';
import { UploadModule } from './upload/upload.module';
import { Contact } from './user/contact.model';
import { AdsModule } from './ads/ads.module';
import { Category } from './ads/category.model';
import { Location } from './location/location.model';
import { LocationModule } from './location/location.module';
import { CarModule } from './car/car.module';
import { Car } from './car/car.model';
import { AdsAuto } from './ads/models/auto.model';
import { AdsPart } from './ads/models/part.model';
import { AdsCarPart } from './ads/models/carPart';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [Location, User, Contact, Album, Category, Car, AdsAuto, AdsPart, AdsCarPart],
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    GalleryModule,
    CabinetModule,
    UploadModule,
    AdsModule,
    LocationModule,
    CarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
