import { Body, Request, Controller, Get, Post, UseGuards, Param, HttpCode, ForbiddenException, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.findAll();
  }

  @Get(':id')
  getPost(@Param() params) {
    return this.postService.findOneById(Number(params.id));
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(204)
  createPost(@Request() req, @Body() body) {
    const postData = {
      ...body,
      author_id: req.user.id
    };

    this.postService.create(postData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async update(@Param() params, @Body() body, @Request() req) {
    const oldPost = await this.postService.findOneById(Number(params.id));

    if (req.user.id !== oldPost.author_id) throw new ForbiddenException();

    this.postService.update(Number(params.id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() params, @Request() req) {
    const oldPost = await this.postService.findOneById(Number(params.id));

    if (req.user.id !== oldPost.author_id) throw new ForbiddenException();

    this.postService.delete(Number(params.id));
  }
}
