/**
 * 왓챠피디아 - 크롤링
 *
 * @author bottlehs
 * @description 왓챠피디아 - 크롤링
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
 const office  = '왓챠피디아';
 const source = 'https://pedia.watcha.com';
 const api = 'https://api-pedia.watcha.com';
 const fs = require('fs');
 let page = 1;
 let gamePlatForm = 'P';
 // C : 클라우드, M : 콘솔, P : PC
 let isLast = true;

 async function getHtml() {
   try {
     const params = {
      query: "*"
     }
     return await axios.get(api+"/api/searches/contents/movies", {
      params: params,
      headers: {
        'x-watcha-client': 'watcha-WebApp',
        'x-watcha-client-language': 'ko',
        'x-watcha-client-region': 'KR',
        'x-watcha-client-version': '2.0.0',
        'x-watcha-remote-addr': '211.54.70.66'
      },
    });
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   let json = {};   

   const response = await getHtml();
   const data = response.data;
   console.log(data);

   /*
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
   */

   return data;
 };
 
 module.exports = { getItems };

  // 개별실행
  async function handleAsync() {
    // 왓챠피디아
    const pediaWatchaRes = await getItems();

    const fileName = 'parse/pedia_watcha/pedia_watcha.json';
    fs.writeFileSync(fileName, JSON.stringify(pediaWatchaRes));        
  }
  
  handleAsync();