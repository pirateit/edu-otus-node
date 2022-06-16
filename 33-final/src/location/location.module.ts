import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationService } from './location.service';
import { Location } from './location.model';
import { LocationController } from './location.controller';

@Module({
  imports: [SequelizeModule.forFeature([Location])],
  providers: [LocationService],
  exports: [LocationService],
  controllers: [LocationController]
})
export class LocationModule {}
