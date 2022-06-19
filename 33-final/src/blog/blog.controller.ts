import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Sequelize } from 'sequelize-typescript';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { BlogService } from './blog.service';

@Controller()
export class BlogController {
  constructor(
    private sequelize: Sequelize,
    private blogService: BlogService,
  ) { }

  @UseGuards(CheckAuthGuard)
  @Get('blogs')
  async getAds(@Param() params, @Req() req, @Res() res) {
    // const

    return res.render(
      'ads',
      { user: req.user, title: 'Объявления' },
    );
  }

  @Post('api/blog')
  @UseGuards(CheckAuthGuard)
  @UseInterceptors(FileInterceptor('cover', {
    storage: diskStorage({
      destination: './uploads/blogs/covers',
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
  async createBlogPost(@Body() postData, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<boolean> {
    const { id } = req.user as any;
    postData.author_id = id;

    if (file) postData.cover = file.filename;
    
    await this.blogService.create(postData);

    return true;
  }
}
