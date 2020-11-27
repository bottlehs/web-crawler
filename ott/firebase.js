var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ohtt-b836a.firebaseio.com",
  storageBucket: process.env.BUCKET_URL
});
app.locals.bucket = admin.storage().bucket()
let db = admin.firestore();

