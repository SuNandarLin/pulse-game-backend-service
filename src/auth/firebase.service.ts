// import { Injectable } from '@nestjs/common';
// import * as admin from 'firebase-admin';

// @Injectable()
// export class FirebaseService {
//   private firebaseApp: admin.app.App;

//   constructor() {
//     this.firebaseApp = admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY,
//       }),
//     });
//   }

//   async verifyToken(token: string) {
//     try {
//       const decodedToken = await this.firebaseApp.auth().verifyIdToken(token);
//       const aud = process.env.FIREBASE_PROJECT_ID;
//       const iss = `https://securetoken.google.com/${aud}`;

//       if (decodedToken.aud !== aud || decodedToken.iss !== iss) {
//         throw new Error('Invalid token');
//       }

//       return decodedToken;
//     } catch (error) {
//       throw new Error('Invalid token');
//     }
//   }
// }
