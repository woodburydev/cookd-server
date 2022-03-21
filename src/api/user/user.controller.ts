import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FirebaseAuthGuard } from '../auth/firebaseAuthGuard';

@Controller('user')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get('/')
  public getUsers(): Promise<User[]> {
    return this.service.getUsers();
  }

  // if we are in production, use guard so that nobody can hit endpoint and get user details
  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  public getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.service.getUser(id);
  }

  @Post()
  public createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.service.createUser(body);
  }
}
