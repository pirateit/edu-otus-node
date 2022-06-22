import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put, Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { Request, Response } from 'express';
import {AnyFilesInterceptor, FileInterceptor} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Sequelize } from 'sequelize-typescript';
import { CheckAuthGuard } from '../auth/check-auth.guard';
import { BlogService } from './blog.service';
import * as fs from "fs";
import {join} from "path";
import {Category} from "./category.enum";
import {Role} from "../auth/role.enum";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller()
export class BlogController {
  constructor(
    private sequelize: Sequelize,
    private blogService: BlogService,
  ) { }

  @UseGuards(CheckAuthGuard)
  @Get('blogs')
  async getPosts(@Query() query, @Req() req, @Res() res) {
    const filters: any = {};

    if (query.cat) filters.category = Number(query.cat);

    const postsData = await this.blogService.find(filters, query.page, query.limit );
    filters.total = postsData.count;
    filters.page = query.page ?? 1;
    filters.totalPages = filters.total < (Number(query.limit) || 5) ? 1 : Math.ceil(filters.total / (Number(query.limit) || 5));

    return res.render(
      'blogs',
      { user: req.user, title: 'Блоги', posts: postsData.rows, categories: Category, filters },
    );
  }

  @UseGuards(CheckAuthGuard)
  @Get('blogs/:id')
  async getPost(@Param() params, @Req() req, @Res() res) {
    const postData = await this.blogService.findOne(params.id);

    return res.render(
        'blogsPost',
        { user: req.user,
          title: postData.title.length > 50 ? postData.title.substring(0, 49) : postData.title,
          post: postData,
          roles: Role, }
    );
  }

  @Post('api/blog')
  @UseGuards(JwtAuthGuard)
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

  @Put('api/blog/:id')
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
  async updateBlogPost(@Body() body, @Param() params, @UploadedFile() file: Express.Multer.File, @Req() req: Request): Promise<boolean> {
    const { id } = req.user as any;
    const postData = await this.blogService.findOne(params.id);
    body.is_active = body.is_active === 'true' ? true : false;

    if (postData.cover) {
      var coverPath = join(process.cwd(), 'uploads', 'blogs', 'covers', postData.cover);
    }

    if (file && fs.existsSync(coverPath)) {
      fs.unlink(join(process.cwd(), 'uploads', 'blogs', 'covers', postData.cover), (err) => {
        if (err) throw err;
      });
    }

    if (file) body.cover = file.filename;

    await this.blogService.update(params.id, body);

    return true;
  }

  @Post('api/blog/:id/comment')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(JwtAuthGuard)
  async createPostComment(@Body() body, @Param() params, @Req() req): Promise<boolean> {
    const { id } = req.user as any;
    body.author_id = id;
    body.post_id = body.post_id ?? params.id;

    await this.blogService.createComment(body);

    return true;
  }
}
