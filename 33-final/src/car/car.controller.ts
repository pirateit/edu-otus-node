import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarService } from './car.service';

@Controller()
export class CarController {
  constructor(
    private carService: CarService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('api/car/:name')
  async getModels(@Param('name') name) {
    const modelsData = await this.carService.getModels(name);
    const models = modelsData.map(model => {
      return {
        id: model.id,
        model: model.model
      };
    });

    return models;
  }

  async getGenerations(@Param() params) {
    const modelsData = await this.carService.getModels(params.name);
    const models = modelsData.map(model => {
      return {
        model: model.model
      };
    });

    return models;
  }
}
