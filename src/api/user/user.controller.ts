import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CanCreateUser, CreateUserDto } from './user.dto';
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
}
