import firebase from '@firebase/app'
import '@firebase/firestore'
import '@firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCRCsoPco8BZeKQE2Do-uez_nrbpeayp_U",
    authDomain: "shaare-6f9db.firebaseapp.com",
    databaseURL: "https://shaare-6f9db-default-rtdb.firebaseio.com",
    projectId: "shaare-6f9db",
    storageBucket: "shaare-6f9db.appspot.com",
    messagingSenderId: "959601231352",
    appId: "1:959601231352:web:397d44c44031941e0d020d",
    measurementId: "G-41LR3790TZ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const storage = firebaseApp.storage()
const vf = firebase.firestore.FieldValue

export {db, vf, storage}