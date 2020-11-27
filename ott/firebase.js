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
const fs = require('fs');


async function fileUpload(filename) {
  const file_uuid = uuid();
  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: file_uuid
    },
    contentType: 'image/jpg',
    cacheControl: 'public, max-age=31536000',
  };

  // Uploads a local file to the bucket
  let upload_filename = await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
  }).then((data) => {
    let file = data[0];

    return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + file_uuid);
    /*
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
    console.log('logging image url' + imageUrl);
    return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
    */
  });
  console.log('업로드');
  console.log(upload_filename);

  return upload_filename;
}

async  function fileDownload(url, dest){
  var file = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    var responseSent = false; // flag to make sure that response is sent only once.
    http.get(url, response => {
      response.pipe(file);
      file.on('finish', () =>{
        file.close(() => {
          if(responseSent)  return;
          responseSent = true;
          resolve();
        });
      });
    }).on('error', err => {
        if(responseSent)  return;
        responseSent = true;
        reject(err);
    });
  });
}

async function handleAsync() {  
  await fileDownload('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg', './files/file.jpg')
  .then( ()=> console.log('downloaded file no issues...'))
  .catch( e => console.error('error while downloading', e));  

  /*
  let file_name = await fileUpload('./ccc.jpg');
  console.log('업로드2');
  console.log(file_name);


  let contentsRef = contents.doc();
  await contentsRef.set({
    hobby: 'asdasdasdasd',
    age: 'asd',
  });  
  */
}

handleAsync();

