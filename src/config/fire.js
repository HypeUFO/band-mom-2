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
var fire = firebase.initializeApp(config);
export default fire;