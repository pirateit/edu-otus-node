import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocationService } from './location.service';

@Controller()
export class LocationController {
  constructor(
    private locationService: LocationService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('api/location/:region/cities')
  async getCities(@Param() params) {
    const citiesData = await this.locationService.getCities(params.region);
    const cities = citiesData.map(city => {
      return {
        id: city.id,
        region: city.region,
        city: city.city
      };
    });

    return cities;
  }
}
