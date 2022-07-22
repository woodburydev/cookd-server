import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';
import { diskStorage } from 'multer';
import { CanCreateCook, CreateCookDto, FetchCookBioData, GetProfilePicture, UpdateCook, UploadProfilePicture } from './cook.dto';
import { Cook } from './cook.entity';
import { uuid } from 'uuidv4';
import { CookService } from './cook.service';

@Controller('cook')
export class CookController {
  @Inject(CookService)
  private readonly service: CookService;

  @Get('/')
  public getCooks(): Promise<Cook[]> {
    return this.service.getCooks();
  }

  @Get('/bioData')
  public fetchCookBioData(
    @Query(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })) body: FetchCookBioData,
  ): Promise<{ bio: string; education: string }> {
    return this.service.fetchCookBioData(body.email);
  }

  @Get('/profilePicture')
  public getProfilePicture(
    @Query(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })) body: GetProfilePicture,
  ): Promise<string> {
    return this.service.getProfilePicture(body);
  }

  @Get(':fbuuid')
  // if we are in production, use guard so that nobody can hit endpoint and get Cook details
  // @UseGuards(FirebaseAuthGuard)
  public getCook(@Param('fbuuid') fbuuid: string): Promise<Cook> {
    return this.service.getCook(fbuuid);
  }

  // protect this route via cors
  @Post()
  public createCook(@Body() body: CreateCookDto): Promise<{ status: string }> {
    return this.service.createCook(body);
  }

  @Post('/canCreate')
  public canCreateCookd(@Body() body: CanCreateCook): Promise<{ status: boolean; reason: string }> {
    return this.service.canCreateCook(body);
  }

  @Post('/update')
  public updateCook(@Body() body: UpdateCook): Promise<{ status: boolean }> {
    return this.service.updateCook(body);
  }

  @Post('/profilePicture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, cb) => {
          cb(null, uuid() + file.originalname);
        },
      }),
    }),
  )
  public postProfilePicture(@UploadedFile() file: Express.Multer.File, @Body() userName: UploadProfilePicture) {
    if (!file) throw new BadRequestException();
    return this.service.uploadProfilePicture(userName, file.filename);
  }
}
