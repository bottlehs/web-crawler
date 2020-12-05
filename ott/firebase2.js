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
  host: '', 
  port: 3306,
  user: '', 
  password: '',
  connectionLimit: 5
});

function getNowTimeStamp() {  
  var d = new Date();  

  var s = fillZeros(d.getFullYear(), 4) + '-' +  
          fillZeros(d.getMonth() + 1, 2) + '-' +  
          fillZeros(d.getDate(), 2) + ' ' +  
    
          fillZeros(d.getHours(), 2) + ':' +  
          fillZeros(d.getMinutes(), 2) + ':' +  
          fillZeros(d.getSeconds(), 2);  

  return s;  
}  


async function insertBorad(i, doc) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    conn.query('USE ohttnet'); // 사용할 DB 명시
    console.log(doc.id); // fire store id
    console.log(doc.data().title); // 제목
    console.log(doc.data().content_type); // 분류
    console.log(doc.data().description); // 설명
    console.log(doc.data().poster.original); // 포스터 이미지
    console.log(doc.data().ratings_avg); // 평점
    console.log(doc.data().source); // 출처
    console.log(doc.data().year); // 출시년도
    let badges = [];
    doc.data().badges.forEach(badge => {
      badges.push(badge.name);
    });
    console.log('badges : ');
    console.log(badges.toString());      
    let genres = [];
    if ( doc.data().genres ) {
      genres = doc.data().genres.toString();
    }
    console.log('genres : ');
    console.log(genres.toString());    

    let write_table = 'g5_write_content_game';
    let wr_num = 0;
    let wr_reply = '';
    let ca_name = '';
    let wr_subject = '제목'; // 콘텐츷 제목
    let wr_content = '내용'; //
    let wr_seo_title = '검색엔진 최적화 제목';
    let wr_link1 = '';
    let wr_link2 = '';
    let mb_id = 'admin';
    let wr_password = '';
    let wr_name = '최고관리자';
    let wr_email = 'admin@domain.com';
    let wr_homepage = '';
    let G5_TIME_YMDHIS = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let REMOTE_ADDR = '211.177.202.158';
    let wr_1 = '';
    let wr_2 = '';
    let wr_3 = '';
    let wr_4 = '';
    let wr_5 = '';
    let wr_6 = '';
    let wr_7 = '';
    let wr_8 = '';
    let wr_9 = '';
    let wr_10 = '';

    if ( doc.data().content_type == 'movies' ) {
      // movies
      write_table = 'g5_write_content_movie';
      wr_link1 = doc.data().poster.source; // 출처
      wr_1 = doc.data().poster.original; // 포스터 이미지
      wr_2 = doc.data().poster.ratings_avg; // 평점
      wr_3 = doc.data().poster.year; // 출시년도      
      wr_4 = badges.toString(); // 제공 서비스
      wr_5 = genres.toString(); // 장르
    } else if ( doc.data().content_type == 'tvseries' ) {
      // tvseries
      write_table = 'g5_write_content_tvseries';
      wr_link1 = doc.data().poster.source; // 출처
      wr_1 = doc.data().poster.original; // 포스터 이미지
      wr_2 = doc.data().poster.ratings_avg; // 평점
      wr_3 = doc.data().poster.year; // 출시년도       
      wr_4 = badges.toString(); // 제공 서비스
      wr_5 = genres.toString(); // 장르       
    } else {
      // games
      write_table = 'g5_write_content_game';
      wr_link1 = doc.data().poster.source; // 출처
      wr_1 = doc.data().poster.original; // 포스터 이미지
      wr_2 = doc.data().poster.ratings_avg; // 평점
      wr_3 = doc.data().poster.year; // 출시년도      
      wr_4 = badges.toString(); // 제공 서비스
      wr_5 = genres.toString(); // 장르      
    }

    // 직열화
    let temp = doc.data();
    temp.id = doc.id;
    wr_10 = JSON.stringify(temp);

    wr_subject = doc.data().title; // 제목
    wr_content = doc.data().description; // 설명
    wr_seo_title = doc.data().title; // 제목

    let rows = await conn.query("select count(*) as cnt from "+write_table+""); // 쿼리 실행    
    
    if ( rows ) {
      wr_num = rows[0].cnt;
      wr_num++;
      wr_num = wr_num * -1;
    }

    let sql = "insert into "+write_table+" "+
              "set wr_num = '"+wr_num+"',"+
              "wr_reply = '"+wr_reply+"',"+
              "wr_comment = 0,"+
              "ca_name = '"+ca_name+"',"+
              "wr_option = 'html1',"+
              "wr_subject = '"+wr_subject+"',"+
              "wr_content = '"+wr_content+"',"+
              "wr_seo_title = '"+wr_seo_title+"',"+
              "wr_link1 = '"+wr_link1+"',"+
              "wr_link2 = '"+wr_link2+"',"+
              "wr_link1_hit = 0,"+
              "wr_link2_hit = 0,"+
              "wr_hit = 0,"+
              "wr_good = 0,"+
              "wr_nogood = 0,"+
              "mb_id = '"+mb_id+"',"+
              "wr_password = '"+wr_password+"',"+
              "wr_name = '"+wr_name+"',"+
              "wr_email = '"+wr_email+"',"+
              "wr_homepage = '"+wr_homepage+"',"+
              "wr_datetime = '"+G5_TIME_YMDHIS+"',"+
              "wr_last = '"+G5_TIME_YMDHIS+"',"+
              "wr_ip = '"+REMOTE_ADDR+"',"+
              "wr_1 = '"+wr_1+"',"+
              "wr_2 = '"+wr_2+"',"+
              "wr_3 = '"+wr_3+"',"+
              "wr_4 = '"+wr_4+"',"+
              "wr_5 = '"+wr_5+"',"+
              "wr_6 = '"+wr_6+"',"+
              "wr_7 = '"+wr_7+"',"+
              "wr_8 = '"+wr_8+"',"+
              "wr_9 = '"+wr_9+"',"+
              "wr_10 = '"+wr_10+"'";    

    // console.log(sql);
    let insert = await conn.query(sql); // 쿼리 실행

    /*
    // 새글 INSERT
    sql_query(" insert into {$g5['board_new_table']} ( bo_table, wr_id, wr_parent, bn_datetime, mb_id ) values ( '{$bo_table}', '{$wr_id}', '{$wr_id}', '".G5_TIME_YMDHIS."', '{$member['mb_id']}' ) ");

    // 게시글 1 증가
    sql_query("update {$g5['board_table']} set bo_count_write = bo_count_write + 1 where bo_table = '{$bo_table}'");    
    */

    console.log(insert);
    
   return true; //insert
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
        snapshot.forEach(async (doc) => {
          await insertBorad(i, doc);
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

