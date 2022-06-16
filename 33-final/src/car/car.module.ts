import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from './car.model';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
  imports: [SequelizeModule.forFeature([Car])],
  providers: [CarService],
  exports: [CarService],
  controllers: [CarController]
})
export class CarModule {}
