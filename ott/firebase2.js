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


var mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: '127.0.0.1', 
  port: 3306,
  user: 'root', 
  password: 'root123',
  connectionLimit: 5
});

async function insertBorad() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    console.log(conn);
    conn.query('USE testdb'); // 사용할 DB 명시
    rows = await conn.query("INSERT INTO testdb.users (email,password,username,firstname,lastname,languege,country,status,role,createdAt,updatedAt) VALUES ('test10@test.com','test1','name1','firstname1','lastname1','ko','KO','register','USER','2020-11-04 10:51:58.000','2020-11-04 10:51:58.000')"); // 쿼리 실행
    console.log(rows);
  }
  catch (err) { throw err; }
  finally {
    if (conn) conn.end();
    return rows;
  }
}

/*
async function getUserList() {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    console.log(conn);
    conn.query('USE testdb'); // 사용할 DB 명시
    rows = await conn.query('SELECT * FROM users'); // 쿼리 실행
  }
  catch (err) { throw err; }
  finally {
    if (conn) conn.end();
    return rows;
  }
}
*/


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

insertBorad();
// handleAsync();

