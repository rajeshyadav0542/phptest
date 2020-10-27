// Initialize Firebase
//~ var config = {
	  //~ apiKey: "AIzaSyAWRH5nKcB0pwxp4NvjDoHg4YAPzi8DaHM",
	  //~ authDomain: "my-test-project-7a9e4.firebaseapp.com",
	  //~ databaseURL: "https://my-test-project-7a9e4.firebaseio.com",
	  //~ projectId: "my-test-project-7a9e4",
	  //~ storageBucket: "my-test-project-7a9e4.appspot.com",
	  //~ messagingSenderId: "892682727457",
	  //~ appId: "1:892682727457:web:0bea171bbfe9e861a3b360"
//~ };

//~ var config = {
	//~ apiKey: "AIzaSyApjUv29tbg2XjbqDAhAzgHnUHrscBdccU",
    //~ authDomain: "chatsystem-416c7.firebaseapp.com",
    //~ databaseURL: "https://chatsystem-416c7.firebaseio.com",
    //~ projectId: "chatsystem-416c7",
    //~ storageBucket: "chatsystem-416c7.appspot.com",
    //~ messagingSenderId: "839091317542",
    //~ appId: "1:839091317542:web:1e352c5a0433670fab6fe7"
//~ }

var config = {
    apiKey: "AIzaSyApjUv29tbg2XjbqDAhAzgHnUHrscBdccU",
    authDomain: "chatsystem-416c7.firebaseapp.com",
    databaseURL: "https://chatsystem-416c7.firebaseio.com",
    projectId: "chatsystem-416c7",
    storageBucket: "chatsystem-416c7.appspot.com",
    messagingSenderId: "839091317542",
    appId: "1:839091317542:web:1e352c5a0433670fab6fe7"
}

//~ var config = {
	//~ apiKey: "AIzaSyC3kAAIAnKpT6__FJqjF2L7HSKKiWXJyOQ",
    //~ authDomain: "depa-minivourcher-demo.firebaseapp.com",
    //~ databaseURL: "https://depa-minivourcher-demo.firebaseio.com",
    //~ projectId: "depa-minivourcher-demo",
    //~ storageBucket: "depa-minivourcher-demo.appspot.com",
    //~ messagingSenderId: "14722883026",
    //~ appId: "1:14722883026:web:d5e2186be0de60adb83c0b",
    //~ measurementId: "G-NJLS77BFRY"
//~ }

firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
//~ db.settings({
	//~ timestampsInSnapshots: true
//~ });
