/**
 * Created by Andy on 22/8/17.
 */
import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyCeA7kJG0wFN6lI8slqHN4BlavQeof8Vxg",
    authDomain: "course-advisor-5eb1f.firebaseapp.com",
    databaseURL: "https://course-advisor-5eb1f.firebaseio.com",
    projectId: "course-advisor-5eb1f",
    storageBucket: "course-advisor-5eb1f.appspot.com",
    messagingSenderId: "77627242049"
};

firebase.initializeApp(config);

export default firebase;