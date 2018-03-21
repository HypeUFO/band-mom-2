import firebase from "firebase";
// Initialize Firebase
const prodConfig = {
  apiKey: "AIzaSyB6ZMK2IUv0AYYT7BwZgm8KDVdUkHWdgvE",
  authDomain: "band-mom.firebaseapp.com",
  databaseURL: "https://band-mom.firebaseio.com",
  projectId: "band-mom",
  storageBucket: "band-mom.appspot.com",
  messagingSenderId: "755887989881"
};

const devConfig = {
  apiKey: "AIzaSyBgl-kcvK3n-vUxTR0LOKoVzfqvKu-DPoM",
  authDomain: "band-mom-dev.firebaseapp.com",
  databaseURL: "https://band-mom-dev.firebaseio.com",
  projectId: "band-mom-dev",
  storageBucket: "band-mom-dev.appspot.com",
  messagingSenderId: "728160646110"
};

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const messaging = firebase.messaging();

// messaging.requestPermission()
// .then(() => {
//   console.log('Permission granted!')
//   return messaging.getToken();
// })
// .then((token) => {
//   console.log(token);
// })
// .catch((err) => console.log('Permission denied', err))

// messaging.onMessage((payload) => {
//   console.log('onMessage: ', payload);
// })
