import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('uploads')
export class UploadController {
  @Get('(.*)')
  getFile(@Req() req: Request, @Res() res: Response) {
    // const file = createReadStream(join(process.cwd(), 'package.json'));

    // file.pipe(res);
  }
}
