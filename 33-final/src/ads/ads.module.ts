import { Module } from '@nestjs/common';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { Category } from './category.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdsAuto } from './models/auto.model';
import { LocationModule } from '../location/location.module';
import { AdsPart } from './models/part.model';
import { AdsCarPart } from './models/carPart.model';
import { CarModule } from '../car/car.module';

@Module({
  imports: [SequelizeModule.forFeature([Category, AdsAuto, AdsPart, AdsCarPart]), LocationModule, CarModule],
  providers: [AdsService],
  controllers: [AdsController],
  exports: [AdsService]
})
export class AdsModule {}
