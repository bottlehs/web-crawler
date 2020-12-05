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
  let rawdata = await fs.readFileSync('./processParse/dataProcess/dataProcess.json');
  let json = await JSON.parse(rawdata);
  // console.log(json.length);
  let complate = 0;
  for(let i = 0; i < json.length; i++) {
    console.log(json[i].content_type);
  }    

  console.log('전체 : '+json.length);
  console.log('성공 : '+complate);

}

handleAsync();
// 완료
