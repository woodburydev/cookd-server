import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { uuid } from 'uuidv4';
import { CanCreateUser, CreateUserDto, GetProfilePicture, UpdateUser, UploadProfilePicture } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get('/')
  public getUsers(): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('/profilePicture')
  public getProfilePicture(@Query() body: GetProfilePicture): Promise<string> {
    return this.service.getProfilePicture(body);
  }

  @Post('/update')
  public updateUser(@Body() body: UpdateUser): Promise<{ status: boolean }> {
    return this.service.updateUser(body);
  }

  @Get(':fbuuid')
  // if we are in production, use guard so that nobody can hit endpoint and get user details
  // @UseGuards(FirebaseAuthGuard)
  public getUser(@Param('fbuuid') fbuuid: string): Promise<User> {
    return this.service.getUser(fbuuid);
  }

  // protect this route via cors
  @Post()
  public createUser(@Body() body: CreateUserDto): Promise<{ status: string }> {
    return this.service.createUser(body);
  }

  @Post('/canCreate')
  public canCreateUser(@Body() body: CanCreateUser): Promise<{ status: boolean; reason: string }> {
    return this.service.canCreateUser(body);
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
