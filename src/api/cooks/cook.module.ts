import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CookController } from './cook.controller';
import { Cook } from './cook.entity';
import { CookService } from './cook.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cook])],
  controllers: [CookController],
  providers: [CookService],
})
export class CookModule {}
