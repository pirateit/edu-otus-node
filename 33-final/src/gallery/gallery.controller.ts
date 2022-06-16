import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { GalleryService } from './gallery.service';
import * as path from 'path';
import { join } from 'path';

@Controller()
export class GalleryController {
  constructor(private galleryService: GalleryService) { }

  @UseGuards(CheckAuthGuard)
  @Get('/gallery')
  async getGalleryPage(@Req() req: Request, @Res() res: Response) {
    const albumsData = await this.galleryService.findActive(true);

    return res.render(
      'gallery',
      { user: req.user, title: 'Фотогалерея', albums: albumsData },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('/gallery/:id')
  async getAlbumPage(@Param() params, @Req() req: Request, @Res() res: Response) {
    const albumData = await this.galleryService.findOne(params.id);
    const album = {
      id: albumData.id,
      title: albumData.title,
      description: albumData.description,
      author: { ...albumData.author },
      photos: [],
    };
    const directoryPath = path.join(__dirname, '../../uploads', 'gallery', params.id);

    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }

      files.forEach(function (file) {
        album.photos.push(file);
      });
    });

    return res.render(
      'gallery-photos',
      { user: req.user, title: `Альбом - ${albumData.title}`, album },
    );
  }

  @Post('api/gallery')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/gallery/covers',
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createAlbum(@Body() albumData, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<boolean> {
    const { id } = req.user as any;
    albumData.author_id = id;

    if (file) albumData.cover = file.filename;

    for (let key in albumData) {
      if (!albumData[key]) delete albumData[key];
    }

    const newAlbumData = await this.galleryService.create(albumData);

    fs.mkdirSync(`./uploads/gallery/${newAlbumData.id}`);

    return true;
  }

  @Put('api/gallery/:id')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/gallery/covers',
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async updateAlbum(@Param() params, @Body() albumData, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<boolean> {
    if (file) albumData.cover = file.filename;

    for (let key in albumData) {
      if (!albumData[key]) delete albumData[key];
    }

    await this.galleryService.findOne(params.id)
      .then(data => {
        if (file && fs.existsSync((join(process.cwd(), 'uploads', 'gallery', 'covers', albumData.cover)))) {
          fs.unlink(join(process.cwd(), 'uploads', 'gallery', 'covers', data.cover), (err) => {
            if (err) throw err;
          });
        }

        data.set(albumData).save();
      });

    return true;
  }

  @Delete('api/gallery/:id')
  async deleteAlbum(@Param() params, @Req() req: Request): Promise<boolean> {
    await this.galleryService.findOne(params.id)
      .then(data => {
        if (fs.existsSync((join(process.cwd(), 'uploads', 'gallery', 'covers', data.cover)))) {
          fs.unlink(join(process.cwd(), 'uploads', 'gallery', 'covers', data.cover), (err) => {
            if (err) throw err;
          });
        }

        fs.rmSync(join(process.cwd(), 'uploads', 'gallery', params.id), { force: true, recursive: true });

        data.destroy();
      });

    return true;
  }

  @Post('api/gallery/:id/photos')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FilesInterceptor('photos', 50, {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, `./uploads/gallery/${req.params.id}`)
      },
      filename: (req, file, callback) => {
        var uniqueSuffix = Date.now();

        callback(null, uniqueSuffix + '-' + file.originalname);
      }
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|webp)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async addPhotos(@Body() albumData, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<boolean> {
    return true;
  }
}
