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
  host: '203.245.44.19', 
  port: 3306,
  multipleStatements: true,
  typeCast: function (field, next) {
    if (field.type == 'LONG' || field.type == 'TINY') {
      return next();
    }
    return field.string();      
  },  
  user: 'ohttnet', 
  password: 'ohttnet1',
  connectionLimit: 20
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

function sleep (delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

async function insertBorad(i, doc) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    conn.query('USE ohttnet'); // 사용할 DB 명시
    console.log(doc.id); // fire store id
    console.log(doc.title); // 제목
    console.log(doc.content_type); // 분류
    console.log(doc.description); // 설명
    console.log(doc.poster.original); // 포스터 이미지
    console.log(doc.ratings_avg); // 평점
    console.log(doc.source); // 출처
    console.log(doc.year); // 출시년도
    let badges = [];
    doc.badges.forEach(badge => {
      badges.push(badge.name);
    });
    console.log('badges : ');
    console.log(badges.toString());      
    let genres = [];
    if ( doc.genres ) {
      genres = doc.genres.toString();
    }
    console.log('genres : ');
    console.log(genres.toString());    

    let write_table = 'g5_write_content_game';
    let bo_table = '';
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

    if ( doc.content_type == 'movies' ) {
      // movies
      write_table = 'g5_write_content_movie';
      bo_table = 'content_movie';

      wr_link1 = doc.poster.source; // 출처
      if ( doc.poster.original ) {
        wr_1 = doc.poster.original; // 포스터 이미지
      } else if ( doc.poster.large ) {
        wr_1 = doc.poster.large; // 포스터 이미지        
      } else if ( doc.poster.medium ) {
        wr_1 = doc.poster.medium; // 포스터 이미지        
      } else if ( doc.poster.small ) {        
        wr_1 = doc.poster.small; // 포스터 이미지        
      } else if ( doc.poster.xlarge ) {        
        wr_1 = doc.poster.xlarge; // 포스터 이미지        
      } else {
        wr_1 = "";
      }
      wr_2 = doc.ratings_avg ? doc.ratings_avg : ''; // 평점
      wr_3 = doc.year ? doc.year : ''; // 출시년도      
      wr_4 = badges ? badges.toString() : badges; // 제공 서비스
      wr_5 = genres ? genres.toString() : genres; // 장르   
    } else if ( doc.content_type == 'tvseries' || doc.content_type == 'tv_seasons' ) {
      // tvseries
      write_table = 'g5_write_content_tvseries';
      bo_table = 'content_tvseries';

      wr_link1 = doc.poster.source; // 출처
      if ( doc.poster.original ) {
        wr_1 = doc.poster.original; // 포스터 이미지
      } else if ( doc.poster.large ) {
        wr_1 = doc.poster.large; // 포스터 이미지        
      } else if ( doc.poster.medium ) {
        wr_1 = doc.poster.medium; // 포스터 이미지        
      } else if ( doc.poster.small ) {        
        wr_1 = doc.poster.small; // 포스터 이미지        
      } else if ( doc.poster.xlarge ) {        
        wr_1 = doc.poster.xlarge; // 포스터 이미지        
      } else {
        wr_1 = "";
      }
      wr_2 = doc.ratings_avg ? doc.ratings_avg : ''; // 평점
      wr_3 = doc.year ? doc.year : ''; // 출시년도      
      wr_4 = badges ? badges.toString() : badges; // 제공 서비스
      wr_5 = genres ? genres.toString() : genres; // 장르      
    } else {
      // games
      write_table = 'g5_write_content_game';
      bo_table = 'content_game';

      wr_link1 = doc.poster.source; // 출처
      if ( doc.poster.original ) {
        wr_1 = doc.poster.original; // 포스터 이미지
      } else if ( doc.poster.large ) {
        wr_1 = doc.poster.large; // 포스터 이미지        
      } else if ( doc.poster.medium ) {
        wr_1 = doc.poster.medium; // 포스터 이미지        
      } else if ( doc.poster.small ) {        
        wr_1 = doc.poster.small; // 포스터 이미지        
      } else if ( doc.poster.xlarge ) {        
        wr_1 = doc.poster.xlarge; // 포스터 이미지        
      } else {
        wr_1 = "";
      }
      wr_2 = doc.ratings_avg ? doc.ratings_avg : ''; // 평점
      wr_3 = doc.year ? doc.year : ''; // 출시년도      
      wr_4 = badges ? badges.toString() : badges; // 제공 서비스
      wr_5 = genres ? genres.toString() : genres; // 장르      
    }

    // 직열화
    let temp = doc;
    temp.id = doc.id;
    wr_10 = JSON.stringify(temp);

    wr_subject = doc.title; // 제목
    wr_content = doc.description; // 설명
    wr_seo_title = doc.title; // 제목
    
    let select_item = await conn.query("select * from "+write_table+" where wr_subject = '"+wr_subject+"'"); // 쿼리 실행          
    console.log('checkcheckcheckcheckcheckcheckcheck');
    console.log('select_item length : '+select_item.length);
    if ( select_item.length != 0 ) {
      let old_wr_10 = JSON.parse(select_item[0].wr_10);
      console.log('old_wr_10 : ');      
      console.log(old_wr_10);      
      console.log('select_item : '+select_item[0].wr_id);
      if (select_item[0].wr_content == undefined || select_item[0].wr_content == 'undefined') {
        select_item[0].wr_content = '';
      };       
      if ( select_item[0].wr_content.length <= wr_content.length ) {
        // 설명 wr_content update
        console.log('설명 wr_content update');
        console.log("update "+write_table+" set wr_content = '"+wr_content+"' where wr_id = "+select_item[0].wr_id+"");
        await conn.query("update "+write_table+" set wr_content = '"+wr_content+"' where wr_id = "+select_item[0].wr_id+"");
        old_wr_10.title = wr_content;
      }
      console.log('select_item[0].wr_1 : '+select_item[0].wr_1);
      if (select_item[0].wr_1 == undefined || select_item[0].wr_1 == 'undefined') {
        select_item[0].wr_1 = '';
        console.log('select_item[0].wr_1 : 초기화');
      };
      if ( select_item[0].wr_1.length <= wr_1.length ) {
        // 포스터 이미지 wr_1 update
        console.log('평정 wr_1 update');       
        await conn.query("update "+write_table+" set wr_1 = '"+wr_1+"' where wr_id = "+select_item[0].wr_id+"");   
        old_wr_10.wr_1 = wr_1;        
      }
      console.log('select_item[0].wr_2 : '+select_item[0].wr_2);
      if (select_item[0].wr_2 == undefined || select_item[0].wr_2 == 'undefined') {
        select_item[0].wr_2 = '';
        console.log('select_item[0].wr_2 : 초기화');
      };
      if ( select_item[0].wr_2.length <= wr_2.length ) {
        // 평정 wr_2 update
        console.log('평정 wr_2 update');       
        await conn.query("update "+write_table+" set wr_2 = '"+wr_2+"' where wr_id = "+select_item[0].wr_id+"");   
        old_wr_10.ratings_avg = wr_2;        
      }
      if (select_item[0].wr_3 == undefined || select_item[0].wr_3 == 'undefined') {
        select_item[0].wr_3 = '';
      };      
      if ( select_item[0].wr_3.length <= wr_3.length ) {
        // 출시년도 wr_3 update
        console.log('출시년도 wr_3 update');   
        await conn.query("update "+write_table+" set wr_3 = '"+wr_3+"' where wr_id = "+select_item[0].wr_id+"");   
        old_wr_10.year = wr_3;        
      }
      if (select_item[0].wr_4 == undefined || select_item[0].wr_4 == 'undefined') {
        select_item[0].wr_4 = '';
      };      
      if ( wr_4.length != 0 ) {
        console.log('forforfor 1');    
        console.log(wr_4);    
        console.log(select_item[0].wr_4);    
        let new_wr_4_array = wr_4.split(',');
        let old_wr_4_array = select_item[0].wr_4.split(',');
        console.log('forforfor 2');
        new_wr_4_array.forEach(row1 => {
          let isPush = true;
          old_wr_4_array.forEach(row2 => {
            if ( row1 == row2 ) {
              isPush = false;
            }
          });
          if ( isPush ) {
            console.log('추가');
            old_wr_4_array.push(row1);
          };
        });
        // 제공 서비스 wr_4 update
        console.log('제공 서비스 wr_4 update');   
        await conn.query("update "+write_table+" set wr_4 = '"+old_wr_4_array.toString()+"' where wr_id = "+select_item[0].wr_id+"");  

        old_wr_4_array.forEach((row1, index) => {
          old_wr_4_array[index] = {
            name: row1,
            service: row1,
            image: '', 
            url: '',                        
          };
        });

        old_wr_10.badges = old_wr_4_array;    
      }    
      if (select_item[0].wr_5 == undefined || select_item[0].wr_5 == 'undefined') {
        select_item[0].wr_5 = '';
      };       
      if ( select_item[0].wr_5.length == 0 && wr_5.length != 0 ) {
        let new_wr_5_array = wr_5.split(',');
        let old_wr_5_array = select_item[0].wr_5.split(',');
        new_wr_5_array.forEach(row1 => {
          let isPush = true;
          old_wr_5_array.forEach(row2 => {
            if ( row1 == row2 ) {
              isPush = false;
            }
          });
          if ( isPush ) {
            console.log('추가');
            old_wr_5_array.push(row1);
          };
        });        
        // 장르 wr_5 update
        console.log('장르 wr_5 update');   
        await conn.query("update "+write_table+" set wr_5 = '"+old_wr_5_array.toString()+"' where wr_id = "+select_item[0].wr_id+"");  

        old_wr_10.genres = old_wr_5_array;    
      }     

      await conn.query("update "+write_table+" set wr_10 = '"+JSON.stringify(old_wr_10)+"' where wr_id = "+select_item[0].wr_id+"");  
      console.log('전체 update');

      conn.release();
    } else {
      console.log('insertinsertinsertinsertinsertinsertinsertinsertinsert');
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
      console.log(insert.insertId);
  
      let out = await conn.query("select * from "+write_table+" where wr_id = "+insert.insertId+"");
  
      // wr_parent 업데이트 할것.    
      await conn.query("update "+write_table+" set wr_parent = "+out[0].wr_id+", wr_num = "+(out[0].wr_id * -1)+" where wr_id = "+out[0].wr_id+"");
      console.log("update "+write_table+" set wr_parent = "+out[0].wr_id+", wr_num = "+(out[0].wr_id * -1)+" where wr_id = "+out[0].wr_id+"");
      out = await conn.query("select * from "+write_table+" where wr_id = "+insert.insertId+"");    
  
      // 새글 INSERT
      // await conn.query("insert into g5_board_new ( bo_table, wr_id, wr_parent, bn_datetime, mb_id ) values ('"+write_table+"', "+out[0].wr_id+", "+out[0].wr_id+", '"+G5_TIME_YMDHIS+"', '"+mb_id+"') ");
      // sql_query(" insert into {$g5['board_new_table']} ( bo_table, wr_id, wr_parent, bn_datetime, mb_id ) values ( '{$bo_table}', '{$wr_id}', '{$wr_id}', '".G5_TIME_YMDHIS."', '{$member['mb_id']}' ) ");
  
      // 게시글 1 증가
      await conn.query("update g5_board set bo_count_write = bo_count_write + 1 where bo_table = '"+bo_table+"'");
      console.log("update g5_board set bo_count_write = bo_count_write + 1 where bo_table = '"+bo_table+"'");
      // sql_query("update {$g5['board_table']} set bo_count_write = bo_count_write + 1 where bo_table = '{$bo_table}'");    
  
      console.log(insert);
      conn.release();

    }

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
  let rawdata = await fs.readFileSync('./firestore.json');
  let json = await JSON.parse(rawdata);
  // console.log(json.length);
  for(let i = 0; i < json.length; i++) {
    await insertBorad(i,json[i]);
    console.log("==============등록=============="+i);
    console.log(json[i].title)
  }
}

handleAsync();

