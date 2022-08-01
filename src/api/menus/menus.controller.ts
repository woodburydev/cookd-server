import { Body, Controller, Get, Inject, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { uuid } from 'uuidv4';
import { CreateMenu, UpdateMenu } from './menus.dto';
import { Menu } from './menus.entity';
import { MenusService } from './menus.service';

@Controller('menu')
export class MenusController {
  @Inject(MenusService)
  private readonly service: MenusService;
  @Get('/')
  public getMenus(): Promise<Menu[]> {
    return this.service.getMenus();
  }

  @Get('/menu/image/:uuid')
  public getMenuImage(@Param('fbuuid') uuid: string): Promise<string> {
    return this.service.getMenuImage(uuid);
  }

  @Get('/:fbuuid')
  // if we are in production, use guard so that nobody can hit endpoint and get user details
  // @UseGuards(FirebaseAuthGuard)
  public getUser(@Param('fbuuid') fbuuid: string): Promise<Menu[]> {
    return this.service.getMenusFromUser(fbuuid);
  }

  @Post('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          if (file) {
            cb(null, uuid() + file?.originalname);
          } else {
            cb(null, undefined);
          }
        },
      }),
    }),
  )
  public createMenu(@UploadedFile() file: Express.Multer.File, @Body() body: CreateMenu): Promise<{ status: string }> {
    return this.service.createMenu(file?.filename, body);
  }

  @Put('/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          if (file) {
            cb(null, uuid() + file?.originalname);
          } else {
            cb(null, undefined);
          }
        },
      }),
    }),
  )
  public updateMenu(@UploadedFile() file: Express.Multer.File, @Body() body: UpdateMenu) {
    return this.service.updateMenu(file?.filename, body);
  }
}
