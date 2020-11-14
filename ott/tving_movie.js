/**
 * 티빙 - 크롤링
 *
 * @author bottlehs
 * @description 티빙 - 크롤링
 *
 */

 /**
  * @todo
  */

 /**
  * @issue
  */  

  /**
  * ResultType : Json
  */
 const axios = require("axios");
 const office  = '티빙';
 const fs = require('fs');

 let page = 1;
 let isLast = true;

 async function getHtml() {
   try {
    const params = {
      'pageNo':page,
      'pageSize':24,
      'order':'viewDay',
      'free':'all',
      'adult':'all',
      'guest':'all',
      'scope':'all',
      'personal':'N',
      'screenCode':'CSSD0100',
      'networkCode':'CSND0900',
      'osCode':'CSOD0900',
      'teleCode':'CSCD0900',
      'apiKey':'1e7952d0917d6aab1f0293a063697610',
      '_':1605379901746
    }

    return await axios.get("https://api.tving.com/v2/media/movies", {
      params: params,
    });
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
    let items = [];
    while (isLast) {
      const response = await getHtml();
      const data = response.data;
      if ( data.body.result ) {     
        console.log(page);   
        const fileName = 'tving/tving_movie_'+page + '.json';
        fs.writeFileSync(fileName, JSON.stringify(data.body.result));    
      } else {
        isLast = false;        
      }

      page++;
    }

    return items;
 };
 
 module.exports = { getItems };

 // 개별실행
 async function handleAsync() {
  // 티빙
  const wavveRes = await getItems();
  console.log(wavveRes);
}

handleAsync();