import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as firebase from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor() {
  //   firebase.initializeApp({
  //     credential: firebase.credential.cert({
  //       projectId: process.env.FIREBASE_PROJECT_ID,
  //       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  //       privateKey: process.env.FIREBASE_PRIVATE_KEY,
  //     }),
  //   });
  // }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authorization.split(' ')[1];

    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);
      const aud = process.env.FIREBASE_PROJECT_ID;
      const iss = `https://securetoken.google.com/${aud}`;

      if (decodedToken.aud !== aud || decodedToken.iss !== iss) {
        throw new Error('Invalid token');
      }
      request['user'] = decodedToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
