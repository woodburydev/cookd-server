if (process.env.NODE_ENV === 'PRODUCTION') {
  module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/src/migrations/*.{ts,js}'],
    migrationsTableName: 'typeorm_migrations',
    logger: 'file',
    synchronize: true, // never use TRUE in production!
    migrationsRun: false,
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };
} else {
  module.exports = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: ['dist/**/*.entity.{ts,js}'],
    migrations: ['dist/src/migrations/*.{ts,js}'],
    migrationsTableName: 'typeorm_migrations',
    logger: 'file',
    synchronize: true, // never use TRUE in production!
    migrationsRun: false,
  };
}
