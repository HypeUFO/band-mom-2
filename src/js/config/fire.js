import firebase from 'firebase'
// Initialize Firebase
var config = {
  apiKey: "AIzaSyB6ZMK2IUv0AYYT7BwZgm8KDVdUkHWdgvE",
  authDomain: "band-mom.firebaseapp.com",
  databaseURL: "https://band-mom.firebaseio.com",
  projectId: "band-mom",
  storageBucket: "band-mom.appspot.com",
  messagingSenderId: "755887989881"
};

firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const storageKey = 'KEY_FOR_LOCAL_STORAGE';

export const isAuthenticated = () => {
  return !!auth.currentUser || !!localStorage.getItem(storageKey);
}
