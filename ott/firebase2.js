var admin = require("firebase-admin");
const { uuid } = require('uuidv4');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ohtt-b836a.firebaseio.com",
  storageBucket: "gs://ohtt-b836a.appspot.com"
});

let bucket = admin.storage().bucket()
let db = admin.firestore();
let contents = db.collection('contents')
const http = require('http');
const https = require('https');
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
var probe = require('probe-image-size');


async function handleAsync() {  
  try {
    contents.get()
    // contents.where('title', '==', '배트맨 대 슈퍼맨: 저스티스의 시작').get()    
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        let i = 0;
        snapshot.forEach(doc => {
          // console.log(doc.id, '=>', doc.data());
          console.log(doc.id);
          i++;
        });
        console.log(snapshot.size)        
        console.log(i);
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });


  } catch ( e ) {
    console.log(e);
  }
}

handleAsync();

