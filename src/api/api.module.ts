import { Module } from '@nestjs/common';
import { CookModule } from './cooks/cook.module';
import { MenuModule } from './menus/menus.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, CookModule, MenuModule],
})
export class ApiModule {}
