var firebase = require('firebase');
//Connect to Firebase
var config = {
    apiKey: "AIzaSyByFsP5QCL99OIyhtLwvIvatHkOjl-kKcw",
    //authDomain: "projectId.firebaseapp.com",
    databaseURL: "https://onet-data.firebaseio.com/",
    //storageBucket: "bucket.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

var userId = firebase.auth().currentUser.uid;
return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  // ...
  console.log("maybe Good");
});