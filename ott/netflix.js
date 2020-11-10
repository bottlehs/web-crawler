/**
 * 넷플릭스 - 신작정보 크롤링
 *
 * @author bottlehs
 * @description 넷플릭스 - 신작정보 크롤링
 *
 */

 /**
  * @todo
  */

 /**
  * @issue
  */

  /**
  * ResultType : HTML
  */
 const axios = require("axios");
 const cheerio = require("cheerio");
 const office  = '넷플릭스';
 const source = 'https://www.netflix.com';
 
 async function getHtml(url) {
   try {
     if ( url ) {
       return await axios.get(url);
     } else {
       return await axios.get(source+"/kr/browse/genre/839338");
     }
   } catch (error) {
     console.error(error);
   }
 }

 async function getItem(url) {
  let json = {};   
  const response = await getHtml(url);
  const $ = cheerio.load(response.data);

  $("script").each(function(i, element) {
    if ( i == 0 ) {
     json = JSON.parse(element.children[0].data.trim());
    }
  });  

  json.json = json['@type'];
  delete json['@type'];
  delete json['@context'];

  if ( json.trailer ) {
    for ( var i = 0; i < json.trailer.length; i++ ) {
      json.trailer[i].type = json.trailer[i]['@type'];
      delete json.trailer[i]['@type'];
    }
  }

  if ( json.actors ) {
    for ( var i = 0; i < json.actors.length; i++ ) {
      json.actors[i].type = json.actors[i]['@type'];
      delete json.actors[i]['@type'];
    }
  }

  if ( json.creator ) {
    for ( var i = 0; i < json.creator.length; i++ ) {
      json.creator[i].type = json.creator[i]['@type'];
      delete json.creator[i]['@type'];
    }  
  }

  return json;
 } 
 
 async function getItems() {
   let items = [];
   let json = {};   
   const response = await getHtml();
   const $ = cheerio.load(response.data);
   $("script").each(function(i, element) {
     if ( i == 0 ) {
      json = JSON.parse(element.children[0].data.trim());
     }
   });

   for ( var i = 0; i < json.itemListElement.length; i++ ) {
    const row = json.itemListElement[i];
    const item = {
      title: row.item.name, // 제목
      url: row.item.url, // 링크
      contentRating: '', // 관람연령
      description: '', // 설명      
      genre: '', // 분류       
      image: '', // 썸네일 이미지     
      dateCreated: '', // 신작 등록일
      startDate: '', // 신작 방송일      
      numberOfSeasons: '', // 시즌정보
      trailer: [], // 트레일러
      actors: [], // 출연진
      creator: [], // 제작자
      director: [], // 감독
      type: row.item['@type'], // 타입
      office: office, // 회사
      source: source // 출처
    };
    
    const view = await getItem(row.item.url);
    item.contentRating = view.contentRating,
    item.description = view.description,  
    item.genre = view.genre,  
    item.image = view.image,
    item.dateCreated = view.dateCreated,
    item.startDate = view.startDate,
    item.numberOfSeasons = view.numberOfSeasons,
    item.trailer = view.trailer,
    item.actors = view.actors,
    item.creator = view.creator,
    item.director = view.director

    console.log(item.startDate);
    
    items.push(item);    
   }

   return items;
 };
 
 module.exports = { getItems };