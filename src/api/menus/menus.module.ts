import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAuthGuard } from '../auth/firebaseAuthGuard';
import { MenusController } from './menus.controller';
import { Menu } from './menus.entity';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenusController],
  providers: [MenusService, FirebaseAuthGuard],
})
export class MenuModule {}
