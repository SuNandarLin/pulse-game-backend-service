import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';
import { AuthGuard } from './auth/auth.guard';
import * as firebase from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  firebase.initializeApp({
    credential: firebase.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
  });

  app.enableCors();
  await app
    .useGlobalGuards(new AuthGuard()) //Comment it out this line to turn off authentication
    .useGlobalInterceptors(new ResponseInterceptor())
    .setGlobalPrefix('/pulse/api/v1')
    .listen(process.env.PORT);

  //localhost:8080 Hello World
}
bootstrap();
