/**
 * OTT - 데이터 가공 2차
 *
 * @author bottlehs
 * @description OTT - 데이터 가공 2차
 *
 */

 /**
  * @todo
  */

 /**
  * @issue
  */

  /**
  * ResultType : No
  */

const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

async function insertData(file) {
  try {
    let rawdata = await fs.readFileSync(file);
    let json = await JSON.parse(rawdata);
    const type_movies = 'movies';    
    const type_tvseries = 'tvseries';
    const type_games = 'games';

    const items = [];
    let item = {};

    console.log('가공전 : '+json.length);

    for(let i = 0; i < json.length; i++) {
      delete json[i].code;
      for(let j = i + 1; j < json.length; ) {
       if(json[i].title === json[j].title && json[j].background_color)
        json.splice(j, 1);
       else if(json[i].title === json[j].title)
        json.splice(i, 1);
      else
       j++;
      }
     }    



    console.log('가공후 : '+json.length);

    return json;
  } catch (error) {
    console.error(error);
    return false;    
  }
}

async function getJsonFile() {
  const rootFolder = './processParse';
  const jsonFils = [];

  try {
    const folder = await readdir(rootFolder);
    for ( let i = 0; i < folder.length; i++ ) {
      const files = await readdir(rootFolder+'/'+folder[i]);
      for ( let j = 0; j < files.length; j++ ) {
        jsonFils.push(rootFolder+'/'+folder[i]+"/"+files[j]);
      };
    };
  } catch (err) {
    console.log(err);

  }

  return jsonFils;
}

async function handleAsync() {
  let progress = {
    all : 0,
    success : 0,
    failed : 0,
  };
  let items = [];

  const jsonFils = await getJsonFile();
  progress.all = jsonFils.length;

  for ( let i = 0; i < jsonFils.length; i++ ) {
    const result = await insertData(jsonFils[i]);
    if ( result ) {
      // 성공
      items = items.concat(result);
      progress.success++;
    } else {
      // 실패
      progress.failed++;        
    }

    // console.log( "all : "+progress.all+" / success : "+progress.success +" / failed : "+ progress.failed );
  };  

  const fileName = 'dataProcess2_2.json';
  console.log(items.length);
  fs.writeFileSync(fileName, JSON.stringify(items));          
}

handleAsync();


/*
fs.readFile( __dirname + '/test.txt', function (err, data) {
  if (err) {
    throw err; 
  }
  console.log(data.toString());
});
*/