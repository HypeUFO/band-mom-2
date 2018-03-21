// import firebase from 'firebase';
// import { messaging } from './src/js/config/fire';
// // const messaging = require('../src/js/config/fire').messaging;

// // var config = {
// //   apiKey: "AIzaSyB6ZMK2IUv0AYYT7BwZgm8KDVdUkHWdgvE",
// //   authDomain: "band-mom.firebaseapp.com",
// //   databaseURL: "https://band-mom.firebaseio.com",
// //   projectId: "band-mom",
// //   storageBucket: "band-mom.appspot.com",
// //   messagingSenderId: "755887989881"
// // };

// // firebase.initializeApp(config);

// let token;

// messaging.getToken()
//     .then(function(currentToken) {
//       if (currentToken) {
//         // sendTokenToServer(currentToken);
//         // updateUIForPushEnabled(currentToken);
//         console.log(currentToken);
//       } else {
//         // Show permission request.
//         console.log('No Instance ID token available. Request permission to generate one.');
//         // Show permission UI.
//       //  updateUIForPushPermissionRequired();
//       //  setTokenSentToServer(false);
//       }
//     })
//     .catch(function(err) {
//       console.log('An error occurred while retrieving token. ', err);
//       //showToken('Error retrieving Instance ID token. ', err);
//       //setTokenSentToServer(false);
//     });

//   messaging.setBackgroundMessageHandler(payload => {
//     const title = 'Hello World';
//     const options = {
//       body: payload.data.status,
//     };
//     self.registration.showNotification(title, options)
//   })

// // curl -X POST --header "Authorization: key=AAAAr_5vZHk:APA91bG8hJ49BMCNQTCNbM-mqY9mi9L7SntVqOZWa9POLQL26nePFC_DtTISdFCfmR86wQf68Ixfs6NRBuGemv0sTL--iS_I6jzhdyIlUDBCafNz-4utAzFm3MHC_gjSuMHycJXaYzWv" --header "Content-Type: application/json" https://fcm.googleapis.com/fcm/send -d "{\"to\":\"<device registration id>\",\"priority\":\"high\",\"notification\":{\"body\": \"FOO BAR BLA BLA\"}}"﻿
