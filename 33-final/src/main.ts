import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerHelper('eq', function (value1, value2) {
    return value1 == value2;
  });
  hbs.registerHelper('not', function (value) {
    return !value;
  });
  hbs.registerHelper('gt', function (value1, value2) {
    return Number(value1) > Number(value2);
  });
  hbs.registerHelper('times', function (n, block) {
    var accum = '';
    for (var i = 0; i < n; ++i)
      accum += block.fn(i + 1);
    return accum;
  });
  hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
  });


  await app.listen(3000);
}
bootstrap();
