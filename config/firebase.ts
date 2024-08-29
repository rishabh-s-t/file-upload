import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: 'AIzaSyAPcEAaJz4YaDDSxMuHYaba_2Z0YmOBYXM',
  authDomain: "file-upload-cc4c4.firebaseapp.com",
  projectId: "file-upload-cc4c4",
  storageBucket: "file-upload-cc4c4.appspot.com",
  messagingSenderId: "1057862026323",
  appId: "1:1057862026323:web:c2cbed74cb5621d00672a6",
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// let analytics: any;
// if (firebaseConfig?.projectId) {
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);

//   // if (
//   //   app.name &&
//   //   typeof window !== "undefined" &&
//   //   firebaseConfig?.projectId &&
//   //   document.cookie.includes("myCookieConsentCookie=true")
//   // ) {
//   //   analytics = getAnalytics(app);
//   // }
// }

// // export {analytics};
