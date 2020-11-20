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
    const type_movies = 'movies';    
    const type_tvseries = 'tvseries';
    const type_games = 'games';

    const items = [];
    let item = {
      /*
      content_type: "books", // 분류
      title: "", // 제목
      year: 2017, // 출시년도
      age: 0, // 나이
      badges: [{
        service: "mars", // 서비스회사명 (영문)
        name: "", // 서비스회사명 (한글)
        image: "", // 로고
      }], // 서비스 회사
      director_names: [""], // 제작자
      description: "", // 설명
      poster: {
        xlarge : "",
        large : "",
        medium : "",
        small : "",
        fullhd: "",
        tizen_preview : "",
        original : ""
      }, // 포스터
      background_color: "#D9D9D9",
      author_names: [""], // 제작자
      genres: ["소설"], // 장르
      nations: [{name:"대한미국"}], // 국가
      ratings_avg, // 평점
      rating: [], // 등급
      time: [], // 시간
      similars, // 비슷한작품
      stillcut: {
        xlarge : "",
        large : "",
        medium : "",
        small : "",
        fullhd: "",
        tizen_preview : "",
        original : ""        
      }, // 스틸컷
      platform: [], // 플랫폼 기기
      service_open_date: "", // 서비스 오픈
      service_end_date: "" // 서비스 료료
      */


      /*
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
      */
    };

    if(file.indexOf('wavve') != -1) {
      // wavve
      item.category_name_ko = json.cell_toplist.title_list[0].text.replace("#","");
      for ( let i = 0; i < json.cell_toplist.celllist.length; i++ ) {
        const list = json.cell_toplist.celllist[i];

        if(file.indexOf('영화') != -1) {
          item.content_type = type_movies;           
        } else {
          item.content_type = type_tvseries;
        };

        item.title = list.title_list[0].text ? list.title_list[0].text : "";
        item.poster = {};
        item.poster.original = list.thumbnail ? list.thumbnail : "";
        item.age = list.age ? list.age : 0;
        if ( list.age_tag ) {
          item.rating = [];          
          item.rating.push(list.age_tag);          
        }
        item.time = list.time ? list.time : 0;

        item.badges = [{
          service: "wavve",
          name: "wavve",
          image: "",
          url: ""
        }];
        item.source = "https://www.wavve.com/";
        items.push(item);  
      }
    } else if ( file.indexOf('tving') != -1 ) {
      // tving
      for ( let i = 0; i < json.length; i++ ) {     
        item.title = json[i].vod_name.ko ? json[i].vod_name.ko : "";
        if ( json[i].program ) {
          item.content_type = type_tvseries;
          // 프로그램
          if ( json[i].program.category1_name.ko ) {
            item.genres = [];
            item.genres.push(json[i].program.category1_name.ko);
          }
          if ( json[i].program.image[0].url ) {
            item.poster = {};
            item.poster.original = "https://image.tving.com"+json[i].program.image[json[i].program.image.length - 1].url;
          }
          item.description = json[i].program.story.ko ? json[i].program.story.ko : "";
          if ( json[i].program.actor ) {
            const actor = json[i].program.actor.join(',');
            if ( !item.credits ) { item.credits = []; };
            for ( let j = 0; j < actor.length; j++ ) {
              item.credits.push({
                person: {
                  name: actor[j]
                }
              });
            };
          };

          if ( json[i].program.director ) {
            const director = json[i].program.director.join(',');
            if ( !item.credits ) { item.credits = []; };
            for ( let j = 0; j < director.length; j++ ) {
              item.credits.push({
                person: {
                  name: director[j]
                }
              });
            };            
          };
        } else {
          item.content_type = type_movies;          
          // 영화
          if ( json[i].movie.category1_name.ko ) {
            item.genres = [];            
            item.genres.push(json[i].movie.category1_name.ko);
          }
          if ( json[i].movie.image[0].url ) {
            item.poster = {};
            item.poster.original = "https://image.tving.com"+json[i].movie.image[json[i].movie.image.length - 1].url;
          }
          item.description = json[i].movie.story.ko ? json[i].movie.story.ko : "";
          if ( json[i].movie.actor ) {
            const actor = json[i].movie.actor.join(',');
            if ( !item.credits ) { item.credits = []; };
            for ( let j = 0; j < actor.length; j++ ) {
              item.credits.push({
                person: {
                  name: actor[j]
                }
              });
            };
          };

          if ( json[i].movie.director ) {
            const director = json[i].movie.director.join(',');
            if ( !item.credits ) { item.credits = []; };
            for ( let j = 0; j < director.length; j++ ) {
              item.credits.push({
                person: {
                  name: director[j]
                }
              });
            };            
          };
        }

        item.service_open_date = json[i].service_open_date ? String(json[i].service_open_date) : "";
        item.service_end_date = json[i].service_end_date ? String(json[i].service_end_date) : "";

        item.badges = [{
          service: "tving",
          name: "tving",
          image: "",
          url: ""
        }];
        item.source = "http://www.tving.com/main.do"; 
        items.push(item);          
      }

    } else if ( file.indexOf('netflix') != -1 ) {      
      // netflix
      /*
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
      */
    } else if ( file.indexOf('pedia_watcha') != -1 ) {         
      // mars 왓챠 netflix 넷플릭스 
      for ( let i = 0; i < json.length; i++ ) {   
        item = {};
        if ( json[i].badges ) {
          for ( let j = 0; j < json[i].badges.length; j++ ) {
            if ( json[i].badges[j].service == 'mars' || json[i].badges[j].service == 'netflix' ) {
              if ( json[i].badges[j].service == 'mars' ) {
                json[i].badges[j].service = 'watcha';
                json[i].badges[j].name = 'watcha';   
                json[i].badges[j].url = '';
                item.source = "https://watcha.com";  
              };
              if ( json[i].badges[j].service == 'netflix' ) {
                json[i].badges[j].service = 'netflix';                
                json[i].badges[j].name = 'netflix';                
                json[i].badges[j].url = '';              
                item.source = "http://www.netflix.com";   
              };
                            
              item = json[i];
              items.push(item);     
            };
          };
        };
      };
    } else if ( file.indexOf('5gxcloudgame') != -1 ) {    
      // 5gxcloudgame
      for ( let i = 0; i < json.length; i++ ) {   
        item = {};
        item.content_type = type_games;
        item.title = json[i].gameTitle;
        item.description = json[i].gameDesc;
        if ( json[i].gameGenre ) {
          if ( !item.genres ) { item.genres = []; };
          item.genres.push(json[i].gameGenre);
        };
        if ( json[i].gameGenreNm ) {
          if ( !item.genres ) { item.genres = []; };
          item.genres.push(json[i].gameGenreNm);
        };
        if ( json[i].gameMaturityRatingNm ) {
          if ( !item.rating ) { item.rating = []; };
          item.rating.push(json[i].gameMaturityRatingNm);
        };
        if ( json[i].gameMaturityRating ) {
          if ( !item.rating ) { item.rating = []; };
          item.rating.push(json[i].gameMaturityRating);
        };
        if ( json[i].gameProduct ) {
          item.author_names = [];
          item.author_names.push(json[i].gameProduct);
        };
        if ( json[i].gamePlatForm ) {
          let gamePlatForm = json[i].gamePlatForm.split('|');
          item.platform = gamePlatForm;
        };
        item.poster = {};
        item.poster.original = json[i].svrFileNm ? "https://www.5gxcloudgame.com/resources/upload/board/"+json[i].svrFileNm : "";
        item.badges = [{
          service: "5gxcloudgame",
          name: "5gxcloudgame",
          image: "",
          url: ""
        }];
        item.source = "https://www.5gxcloudgame.com"; 

        items.push(item);        
      };

    } else if ( file.indexOf('kt5ggame') != -1 ) {    
      // kt5ggame
      for ( let i = 0; i < json.length; i++ ) {   
        if ( json[i].title ) {
          item = {};
          item.content_type = type_games;
          item.title = json[i].title ? json[i].title : "";
          item.description = json[i].description ? json[i].description : "";   
          item.poster = {};
          item.poster.original = json[i].img ? json[i].img : "";
          item.badges = [{
            service: "kt5ggame",
            name: "kt5ggame",
            image: "",
            url: json[i].url ? json[i].url : ""
          }];
          
          if ( json[i].date ) {
            const date = json[i].date.split('-');
            item.year = Number(date[0]);
          }
          if ( json[i].category ) {
            item.genres = [];
            item.genres.push([json[i].category]);
          };
          item.source = "https://www.kt5ggame.com";   
          items.push(item);                  
        }
      };
    } else if ( file.indexOf('stadia') != -1 ) {    
      // stadia
      if ( json.stadia_game_list ) {
        for ( let i = 0; i < json.stadia_game_list.length; i++ ) {   
          item = {};
          item.content_type = type_games;       
          item.title = json.stadia_game_list[i].title ? json.stadia_game_list[i].title : "";
          item.poster = {};
          item.poster.original = json.stadia_game_list[i].url ? json.stadia_game_list[i].url : "";
          item.badges = [{
            service: "stadia",
            name: "stadia",
            image: "",
            url: "",
          }],
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

    // console.log( "all : "+progress.all+" / success : "+progress.success +" / failed : "+ progress.failed );
  };  

  const fileName = 'dataProcess.json';
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