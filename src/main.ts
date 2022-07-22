import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // add later
  // app.enableCors();

  await app.listen(port, () => {
    console.log('[WEB]', config.get<string>('BASE_URL'));
  });
}

bootstrap();
// Set the config options
const adminConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const adminConfig2: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID_2,
  privateKey: process.env.FIREBASE_PRIVATE_KEY_2.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL_2,
};
// Initialize the firebase admin app
export const cookdAdminSDK = admin.initializeApp(
  {
    credential: admin.credential.cert(adminConfig),
  },
  'first',
);

export const cookdChefAdminSDK = admin.initializeApp(
  {
    credential: admin.credential.cert(adminConfig2),
  },
  'second',
);

export const cookdChefBucket = cookdChefAdminSDK.storage().bucket('gs://cookd-chef.appspot.com');
export const cookdBucket = cookdAdminSDK.storage().bucket('gs://cookd-f2872.appspot.com');
