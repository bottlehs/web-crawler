/**
 * OTT - 데이터 가공
 *
 * @author bottlehs
 * @description OTT - 데이터 가공
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
    const type_video = 'video';
    const type_game = 'game';

    const items = [];
    const item = {
      type: "", // 분류
      content_type: "", // 콘텐츠 분류
      url: "", // 링크
      title_ko: "", // 한글 제목
      title_en: "", // 영문 제목      
      category_name_ko: "", // 한글 카테고리
      category_name_en: "", // 영문 카테고리
      genre : "", // 장르
      genre_name : "", // 장르명
      thumbnail: "", // 썸네일
      description_ko: "", // 한글 설명
      description_en: "", // 영문 설명
      actor : "", // 출연진
      creator : "", // 제작자
      director : "", // 감독
      product: "", // 제춤
      age: 0, // 연령
      age_tag: "", // 연령 태그
      rating_name: "", // 등급
      rating: "", // 등급명
      platform: "", // 플랫폼 ( M/C/P )
      platform_name: "", // 플랫폼명 ( 콘솔/클라우드/PC )
      time: 0, // 시간
      service_open_date: "", // 서비스 시작
      service_end_date: "", // 서비스 종료
      start_date: "", // 출시일
      date_created: "", // 등록일
      company_ko: "", // 한글 회사명
      company_en: "", // 영문 회사명
      source: "", // 출처
    };

     /*
| 필드      | 필드명 | 제공여부 |
| ------------ | ---------- | ------: |
| type       | 분류          | 자체   |
| content_type       | 콘텐츠 분류       | 넷플릭스  |
| url       | 링크       | 웨이브,티빙,넷플릭스  |    
| title_ko       | 한글 제목       | 웨이브,티빙,넷플릭스  |
| title_en       | 영문 제목       | 티빙  |
| category_name_ko       | 한글 카테고리       | 웨이브,티빙  |
| category_name_en       | 영문 카테고리       |   |
| genre       | 장르       | 넷플릭스  |
| thumbnail       | 썸네일       | 웨이브,티빙,넷플릭스  |
| description_ko       | 한글 설명       | 티빙,넷플릭스  |
| description_en       | 영문 설명       |   |
| actor       | 출연진       | 티빙,넷플릭스  |
| creator       | 제작자       | 티빙,넷플릭스  |
| director       | 감독       | 티빙,넷플릭스  |    
| age       | 연령       | 웨이브  |
| age_tag       | 연령 태그       | 넷플릭스  |
| time       | 시간       | 웨이브  |
| service_open_date       | 서비스 시작       | 티빙  |    
| service_end_date       | 서비스 종료       | 티빙  |
| start_date       | 출시일       | 넷플릭스  |
| date_created       | 등록일       | 넷플릭스  |
| company_ko       | 한글 회사명       | 자체  |            
| company_en       | 영문 회사명       | 자체  |            
| source       | 출처       | 자체  |            
    */



    if(file.indexOf('wavve') != -1) {
      // wavve
      item.category_name_ko = json.cell_toplist.title_list[0].text.replace("#","");
      for ( let i = 0; i < json.cell_toplist.celllist.length; i++ ) {
        const list = json.cell_toplist.celllist[i];
        item.type = type_video;
        item.title = list.title_list[0].text ? list.title_list[0].text : "";
        item.thumbnail = list.thumbnail ? list.thumbnail : "";
        item.age = list.age ? list.age : 0;
        item.age_tag = list.age_tag ? list.age_tag : "";
        item.time = list.time ? list.time : 0;
        item.company_ko = "웨이브"; 
        item.company_en = "wavve";
        item.source = "https://www.wavve.com/";     
        items.push(item);  
      }
    } else if ( file.indexOf('tving') != -1 ) {
      // tving
      for ( let i = 0; i < json.length; i++ ) {     
        item.type = type_video;        
        item.title_ko = json[i].vod_name.ko ? json[i].vod_name.ko : "";
        item.title_en = json[i].vod_name.en ? json[i].vod_name.en : "";

        if ( json[i].program ) {
          // 프로그램
          item.category_name_ko = json[i].program.category1_name.ko ? json[i].program.category1_name.ko : "";
          item.category_name_en = json[i].program.category1_name.en ? json[i].program.category1_name.en : "";
          item.thumbnail = json[i].program.image[0].url ? "https://image.tving.com"+json[i].program.image[json[i].program.image.length - 1].url : ""          
          item.description_ko = json[i].program.story.ko ? json[i].program.story.ko : "";
          item.description_en = json[i].program.story.en ? json[i].program.story.en : "";
          item.actor = json[i].program.actor ? json[i].program.actor.join(',') : "";        
          item.director = json[i].program.director ? json[i].program.director.join(',') : "";                
        } else {
          // 영화
          item.category_name_ko = json[i].movie.category1_name.ko ? json[i].movie.category1_name.ko : "";
          item.category_name_en = json[i].movie.category1_name.en ? json[i].movie.category1_name.en : "";
          item.thumbnail = json[i].movie.image[0].url ? "https://image.tving.com"+json[i].movie.image[json[i].movie.image.length - 1].url : ""          
          item.description_ko = json[i].movie.story.ko ? json[i].movie.story.ko : "";
          item.description_en = json[i].movie.story.en ? json[i].movie.story.en : "";
          item.actor = json[i].movie.actor ? json[i].movie.actor.join(',') : "";        
          item.director = json[i].movie.director ? json[i].movie.director.join(',') : "";                
        }

        item.service_open_date = json[i].service_open_date ? String(json[i].service_open_date) : "";
        item.service_end_date = json[i].service_end_date ? String(json[i].service_end_date) : "";
        item.company_ko = "티빙"; 
        item.company_en = "tving"; 
        item.source = "http://www.tving.com/main.do"; 
        items.push(item);          
      }
    } else if ( file.indexOf('netflix') != -1 ) {      
      // netflix
      for ( let i = 0; i < json.length; i++ ) {   
        item.type = type_video;        
        item.title_ko = json[i].title ? json[i].title : "";
        item.rating_name = json[i].contentRating ? json[i].contentRating : "";
        item.start_date = json[i].startDate ? json[i].startDate : "";
        item.date_created = json[i].dateCreated ? json[i].dateCreated : "";
        item.description_ko = json[i].description ? json[i].description : "";
        item.genre = json[i].genre ? json[i].genre : "";
        item.thumbnail = json[i].image ? json[i].image : "";        
        item.content_type = json[i].type ? json[i].type : "";
        item.url = json[i].url ? json[i].url : "";
        
        // actors
        if ( json[i].actors ) {
          let actors = [];          
          json[i].actors.forEach(row => {
            actors.push(row.name);
          })
          item.actor = actors.join(',');
        }

        // creator
        if ( json[i].creator ) {
          let creator = [];          
          json[i].creator.forEach(row => {
            creator.push(row.name);
          })
          item.creator = creator.join(',');
        }

        // director
        if ( json[i].director ) {
          let director = [];          
          json[i].director.forEach(row => {
            director.push(row.name);
          })
          item.director = director.join(',');
        }

        item.company_ko = "넷플릭스"; 
        item.company_en = "netflix"; 
        item.source = "http://www.netflix.com"; 

        items.push(item);
      };
    } else if ( file.indexOf('5gxcloudgame') != -1 ) {    
      // 5gxcloudgame
      for ( let i = 0; i < json.length; i++ ) {   
        item.type = type_game;
        item.title_ko = json[i].gameTitle;        
        item.title_en = json[i].gameTitle;
        item.description_ko = json[i].gameDesc;
        item.genre = json[i].gameGenre;
        item.genre_name = json[i].gameGenreNm;        
        item.rating_name = json[i].gameMaturityRatingNm ? json[i].gameMaturityRatingNm : "";
        item.rating = json[i].gameMaturityRating ? json[i].gameMaturityRating : "";    
        item.product = json[i].gameProduct ? json[i].gameProduct : "";    
        
        // gamePlatForm
        if ( json[i].gamePlatForm ) {
          let gamePlatForm = json[i].gamePlatForm.split('|');
          item.platform = gamePlatForm.join(',');
        };

        item.platform_name = json[i].gamePlatFormNm ? json[i].gamePlatFormNm : "";      
        item.thumbnail = json[i].svrFileNm ? "https://www.5gxcloudgame.com/resources/upload/board/"+json[i].svrFileNm : "";

        item.company_ko = "엑스클라우드"; 
        item.company_en = "5gxcloudgame"; 
        item.source = "https://www.5gxcloudgame.com"; 

        items.push(item);        
      };
    } else if ( file.indexOf('kt5ggame') != -1 ) {    
      // kt5ggame
      for ( let i = 0; i < json.length; i++ ) {   
        item.type = type_game;       
        if ( json[i].title ) {
          item.platform_name = json[i].title ? json[i].title : "";
          item.product = json[i].production ? json[i].production : "";   
          item.description_ko = json[i].description ? json[i].description : "";   
          item.url = json[i].url ? json[i].url : "";   
          item.thumbnail = json[i].img ? json[i].img : "";   
          item.category_name_ko = json[i].category ? json[i].category : "";          
          item.start_date = json[i].date ? json[i].date : "";        
          item.company_ko = "게임박스"; 
          item.company_en = "kt5ggame"; 
          item.source = "https://www.kt5ggame.com";           

          items.push(item);                  
        }
      };
    } else if ( file.indexOf('stadia') != -1 ) {    
      // stadia
      if ( json.stadia_game_list ) {
        for ( let i = 0; i < json.stadia_game_list.length; i++ ) {   
          item.type = type_game;       

          item.title_ko = json.stadia_game_list[i].title ? json.stadia_game_list[i].title : "";   
          item.title_en = json.stadia_game_list[i].title ? json.stadia_game_list[i].title : "";   
          item.thumbnail = json.stadia_game_list[i].url ? json.stadia_game_list[i].url : "";   

          item.company_ko = "스테디아"; 
          item.company_en = "stadia"; 
          item.source = "https://stadia.google.com/";           

          items.push(item);    
        }
      }
    }

    return items;
  } catch (error) {
    console.error(error);
    return false;    
  }
}

async function getJsonFile() {
  const rootFolder = './parse';
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

    console.log( "all : "+progress.all+" / success : "+progress.success +" / failed : "+ progress.failed );
  };  

  const fileName = 'dataProcess.json';
  fs.writeFileSync(fileName, JSON.stringify(items));          

  console.log('items : ' + items.length);
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