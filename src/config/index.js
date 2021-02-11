import config from "./config";
import firebase from "firebase";

firebase.initializeApp(config());
firebase.analytics();
export const _database = firebase.database();
export const _firebase = firebase;
