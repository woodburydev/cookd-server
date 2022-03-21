import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateCookDto } from './cook.dto';
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

  @Get(':id')
  public getCook(@Param('id', ParseIntPipe) id: number): Promise<Cook> {
    return this.service.getCook(id);
  }

  @Post()
  public createCook(@Body() body: CreateCookDto): Promise<Cook> {
    return this.service.createCook(body);
  }
}
