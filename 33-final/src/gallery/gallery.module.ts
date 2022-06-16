import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Album } from './album.model';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [SequelizeModule.forFeature([Album])],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService]
})
export class GalleryModule {}
