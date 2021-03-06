import { ExecutionContext, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard {
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const bearerString = request.headers.authorization;
      const token = bearerString.split(' ')[1];
      return admin
        .auth()
        .verifyIdToken(token)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error('Error while verifying Firebase ID token:', error);
          return false;
        });
    } catch (error) {
      console.log('JWT not passed properly');
      return false;
    }
  }
}
