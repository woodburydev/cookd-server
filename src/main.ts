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
  privateKey:
    `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDE675v6zaoond5\n/G4FzgFGGCBW6Cczh6zZIAjCyKvClevmoBIpHVFVfd/ZJAaKbSIJVjd1ot5nwD0N\nScKxtEKEYmBXfiZu4mlIoyIyw2Kn6iMQm4QUPiehStwDb6dn7wBi+J5xOalWs6oY\nI4zmtWK1TQaB7oRSN9K31eUVGDgpq/LkeO2pzrBgA4K0BL8W/98JvjMJv04iUtzw\nadYW+MN0g4HlLZZGxL3OJDTx7PkXr4rIuagfAqSWAQYoZtHXM/8wPO2tozLGVhnE\nS1BqZgsbB51pWa6BC8M1djrQ6s6BjrFrumlTckWYCqgiYKBnnA7RWDPCcz/Aoif7\naTcqgy2RAgMBAAECggEAAuKusSCD5fWP/T7LfKypqH2X4zgeg275c5rIYBTNTgIR\nAWmO7JDuOTvJgvq3+RErcJI1qLTO0BvBNUOzfXO+DgcsQNnzjZhGGUsxKAfkhx/7\nXK3fsgV9YovYlJkPLZrjIUAh/7gb5O4n59fFA7gskqom1lJwuEzyurCA3WXUBFnG\n5U3WU5hkGRsAW0vrGum7aaprWAqjs2v0w8LJF1nhFTJIaLLEaAVkKeEbQHGw4xS1\nBpfraFlu1oxGGxK2aAESdF6mkvEzOH2wGeTcrdg042ibZ12svkrJawk6OZboy5ZC\nOpc/moNbuckJo9r9Nc577bEQTqqnRENhenp7GhEm4QKBgQDob2ANR/U9aoXALV+t\nbK/0aQdIxdw85JV8uVZ9uMaEYCmkP15NTT/pp7E3t7VtbOfrz6XAgpUDotEhTtPX\nMzyAY7EJ2i3juu2LY9MlpeUnyaY86O+yspg1YITzYIzvp5xEnityKVhsXlF+GCWq\nTIsTuLHpBs/ZECopkLc0/VaMoQKBgQDY4qH6+ZNJeTBDCbqSUYBMFwmV63QbAUjD\nm7Z3AUBGsK+cG323j9LrtCXQC5jxNijHECbIGX8oBxnLIeYoUV25GHXYcDNnSSVj\nBORyFttuAjlbT34IAuSYMT2EmeaSyzQ8bO3mQA3SdMAhwScqvjpjVQgxlGlav7Dt\ncXQ5T/qK8QKBgGqncHOnqShdULI2H8j8LmEAMI97+usWGGH6yW029CCZ34G2chcW\nc1VL1U2zxlRHvMO/rFcBlE7uzvdxrFL697ASDpJuws/UXluvmpuT2+q95MHeQN7G\nhIE5oMfsbb8qMdJqoZTo0+ImBU7O1bmnFcoe3cQHlCgN+srH1MlD1gsBAoGBALvd\nk/GRvcMm9mcbRkD31+oRCnySN0AtHJpThvoOW17gLT1Lktot+sWwhhBv+0r1Xt0P\nYIhzjXFetTj/ZB4IXOa4CVwx1FTjRz8+PaOVqPzhcE1nzgOifeBWxrLVnKQK4HR2\n5ptLYK2r88FJTmP34xunzDEmHRw+b0M9wy7h2GQBAoGAW3QyYIOug8Ycf+oZyXs8\n0Z7BjzIyCWMtAI7JZqZasR6PTSlDDsm5SAsT/KXItJSfDVeF0A9l/rYLlG72IJ2Q\nTHeZCYJ6DuwrcpFe+JBMnPuTyjxql07Fr+Yrv8FZv0R1jVmtkkjfHhSG26niTC1P\nCvWWqUq95M2NlBqle7JU78s=\n-----END PRIVATE KEY-----\n`.replace(
      /\\n/g,
      '\n',
    ),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const adminConfig2: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID_2,
  privateKey:
    `-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDNeYavoUrsM382\n9wKcqrwoo8Kw0gRvasGNplm/fD4KsSv4U2rA+ptVO6Zixfwg84rtxSfj33hHpyFb\naoMxYjAU11AG7SHSAv4EiB3AdSYo8J7Mn9IJQlBCRGSXqwPzhR6+u1Dtxl+sRwNF\nWsFODX4n+Pbnea1XdGz7RFx2+2ElEBSU3gVhInocA1fcGEFbWMGVW3JMz8Ma43er\nMikjp/oREKLlS8ZkbiT/IHhhwb8H+0w5fbJLaxnw8I6fta6Ek3DXe39upk4/S6K1\nl3o/jWx9WSDGf7qhshW/u1M4+g3nIQ0fzQSuKd5x3yXkHe+mqSOK6/wIYcO1+Row\nU/VRzfQZAgMBAAECggEAC9R/n+yIKQXFAQfjN1xwJWHaU35gAX8ywiJOAAOZ+dke\nCDfbSV2UZGmhCIZQICCNgueLRqgm3288sSv2fjkiPgzwf1mXTSVddSrWFa7ZAdnq\ntqrL97sA7nPMG9xdh5+GN+KGhA4cE4nqIwvY3dLSjOAdbRHZHFQocyYKMdKC0xSZ\npJdVJj1tfPSNpT7hD9MjuYnJiCdPLlCG9TkS9Ys0AFt3Kj10DlwpcfPHMd1DzNcX\n9yR35/HUVA3ehsqWh+0KNmzrImAyUul6FGeh4yoLcg1FBLEibnoRUR5UzOPl4jh+\nHD6BiwfLyNQzrD+oZGc73dthPkXvQG6Ojo5UX7fRRQKBgQD9QZvN/7SV7nulAgp8\n6v22cvQbzXh1bjxVqodl1J8k1rLyFgFXu3s21t3lC0yDlnStWVo/HV+rjCjqhXVE\n9ebCURS3iChNkDxGdTu45UDLBennPnqAvhChOQsyJcsxadvmFRjYWtPetaXww2Ak\nqhn1o5uZI2HPzkHNssXev70LvQKBgQDPs2XrwuKFJoWsYti95RaIWWAF0Mizyo8Q\nG7OWZ1RO/ZQEUHHQUevwPFx7lPsUzEtJFc8l4A5/7DzsotFgnh8lQgVQ5TtHjv/S\n/W5O7WCNlMNmYVIjX6uUBylOxWsFqfArfJNQ8WTnWmPzTbwaquXm8orylP9OeL/3\nhcoAPvnBjQKBgQDI/MeUvclob+KquqruJmSB5kr6wZ9GutyhM/vOgeZnCwjq/THF\nmaGYjP9+5e+sQryIUnA/xKUHdO2H6bB+sRSYxFZHrYQmwkBDvohOHYrFVQUjoz7/\na1exS58qBjpzFcsRl06nbbXVep2eLL/heSmu+0/iQeU/UTaB8837EHoMlQKBgQDK\nPx5X3IVGsqQnoHj9MD4otx7RiuRkbjGwtcjCBAwMfs/LA6pP9/WPELfdfsyfC++j\nUyFK+EomNpt8sW7AbjhVx1v10cFPhOeHRFBNesgyFVHQN6QL3fTtR6vpkEMOWNQN\nBFlO0EA5J8N7/43TSeZkZHj4ji2s89e55wU0CB6bYQKBgQDt8hWaCrqhvMT2SiEj\nijrMXgPFcziASYcRpncDH1VEQeXJBXJLYBnOxBmCvKd8jp7T620SaOz89RufI+ca\nHWy+2lewwhm8L1n9eu6hbG+F9cYmKCmeqK3crvoROQbc4EMVH5eAEILr4a4KiAe2\nz/dqX5kMGNVoTm1V4bC72NOjPw==\n-----END PRIVATE KEY-----\n`.replace(
      /\\n/g,
      '\n',
    ),
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
