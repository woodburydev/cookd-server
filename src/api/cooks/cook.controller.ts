import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CanCreateCook, CreateCookDto } from './cook.dto';
import { Cook } from './cook.entity';
import { CookService } from './cook.service';

@Controller('cook')
export class CookController {
  @Inject(CookService)
  private readonly service: CookService;

  @Get('/')
  public getCooks(): Promise<Cook[]> {
    return this.service.getCooks();
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
}
