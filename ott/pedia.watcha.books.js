/**
 * 왓챠피디아 - 책 크롤링
 *
 * @author bottlehs
 * @description 왓챠피디아 - 책 크롤링
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
 let isLast = true;

 async function getHtml(url) {
   try {
    if ( url ) {
      return await axios.get(url,{
        headers: {
          'x-watcha-client': 'watcha-WebApp',
          'x-watcha-client-language': 'ko',
          'x-watcha-client-region': 'KR',
          'x-watcha-client-version': '2.0.0',
          'x-watcha-remote-addr': '211.54.70.66'
        },
      });
    } else {
      const params = {
        query: "*",
        size: 9,
        page: page,
       }
       return await axios.get(api+"/api/searches/contents/books", {
        params: params,
        headers: {
          'x-watcha-client': 'watcha-WebApp',
          'x-watcha-client-language': 'ko',
          'x-watcha-client-region': 'KR',
          'x-watcha-client-version': '2.0.0',
          'x-watcha-remote-addr': '211.54.70.66'
        },
      });
    }     
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let json = [];   
   while (isLast) {
    const response = await getHtml();
    if ( response.status == 200 ) {
      const data = response.data.result;     

      if ( data.result ) {
        for ( var i = 0; i < data.result.length; i++ ) {
          console.log(data.result[i].code);
          // 이 작품이 담긴 컬렉션 ( 유저 데이터 )
          // await getHtml(api+'/api/contents/m5mY1nD/decks?page=2&size=5');

          // 비슷한 작품
          let similars = [];
          let credits = [];

          const responseSimilars = await getHtml(api+'/api/contents/'+data.result[i].code+'/similars?page=1&size=10000');
          if ( responseSimilars.status == 200 ) {
            const dataSimilars = responseSimilars.data.result;
            if ( dataSimilars.result ) {
              similars = similars.concat(dataSimilars.result);
            }
          }         
          
          data.result[i].similars = similars;     
        }

        json = json.concat(data.result);

        const fileName = 'parse/pedia_watcha/pedia_watcha_books_page_'+page+'.json';
        fs.writeFileSync(fileName, JSON.stringify(data.result));              
      } else {
        isLast = false;
      };

      if ( data.next_uri ) {
        // next
        console.log('next');
        page++;
      } else {
        isLast = false;
        // exit
      }
    }
  }

   return json;
 };
 
 module.exports = { getItems };

  // 개별실행
  async function handleAsync() {
    // 왓챠피디아 책
    const pediaWatchaRes = await getItems();
    console.log('책 총합 : '+pediaWatchaRes.length);

    const fileName = 'parse/pedia_watcha/pedia_watcha_books.json';
    fs.writeFileSync(fileName, JSON.stringify(pediaWatchaRes));        
  }
  
  handleAsync();