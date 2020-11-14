/**
 * 엑스클라우드 - 크롤링
 *
 * @author bottlehs
 * @description 엑스클라우드 - 크롤링
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
 const office  = '엑스클라우드';
 const source = 'https://www.5gxcloudgame.com';
 const fs = require('fs');
 let page = 1;
 let gamePlatForm = 'P';
 // C : 클라우드, M : 콘솔, P : PC
 let isLast = true;

 async function getHtml() {
   try {
     return await axios.post(source+"/intro/gameListAjax", {
      "viewType": "game",
      "isLastPage": "false",
      "currentPageNo": page,
      "bbsId": "",
      "gameGenre": "",
      "gamePlatForm": gamePlatForm
     });
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   let json = {};   

   while (isLast) {
    const response = await getHtml();
    const data = response.data.resultData;
    if ( data.resultData ) {
     json = data.resultData;
     console.log(json)
 
     for ( var i = 0; i < json.length; i++ ) {
       console.log(json[i]);
       json[i].office = office;

       items.push(json[i]);
     };    

     page++;
    } else {
     isLast = false;
    }    
   };

   return items;
 };
 
 module.exports = { getItems };

  // 개별실행
  async function handleAsync() {
    // 엑스클라우드
    const netflixRes = await getItems();

    const fileName = '5gxcloudgame/5gxcloudgame_'+gamePlatForm+'.json';
    fs.writeFileSync(fileName, JSON.stringify(netflixRes));        
  }
  
  handleAsync();