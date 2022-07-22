import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (process.env.NODE_ENV === 'PRODUCTION') {
      return {
        type: 'postgres',
        url: process.env.HEROKU_POSTGRESQL_PUCE_URL,
        entities: ['dist/**/*.entity.{ts,js}'],
        migrations: ['dist/src/migrations/*.{ts,js}'],
        migrationsTableName: 'typeorm_migrations',
        logger: 'file',
        synchronize: true, // never use TRUE in production!
        migrationsRun: false,
        autoLoadEntities: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      };
    } else {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        // host: process.env.DATABASE_HOST,
        // database: process.env.DATABASE_NAME,
        // username: process.env.DATABASE_USER,
        // password: process.env.DATABASE_PASSWORD,
        entities: ['dist/**/*.entity.{ts,js}'],
        migrations: ['dist/src/migrations/*.{ts,js}'],
        migrationsTableName: 'typeorm_migrations',
        autoLoadEntities: true,
        logger: 'file',
        synchronize: true, // never use TRUE in production!
        migrationsRun: false,
        ssl: false,
      };
    }
  }
}
