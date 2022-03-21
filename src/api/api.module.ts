import { Module } from '@nestjs/common';
import { CookModule } from './cooks/cook.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, CookModule],
})
export class ApiModule {}
