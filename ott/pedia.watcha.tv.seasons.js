/**
 * 왓챠피디아 - TV 시리즈 크롤링
 *
 * @author bottlehs
 * @description 왓챠피디아 - TV 시리즈 크롤링
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
       return await axios.get(api+"/api/searches/contents/tv_seasons", {
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

          // 출연
          const responseCredits1 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=1&size=20');
          if ( responseCredits1.status == 200 ) {
            const dataCredits1 = responseCredits1.data.result;
            if ( dataCredits1.result ) {
              credits = credits.concat(dataCredits1.result);
            }
          }
          const responseCredits2 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=2&size=20');
          if ( responseCredits2.status == 200 ) {
            const dataCredits2 = responseCredits2.data.result;
            if ( dataCredits2.result ) {
              credits = credits.concat(dataCredits2.result);
            }
          }
          const responseCredits3 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=3&size=20');
          if ( responseCredits3.status == 200 ) {
            const dataCredits3 = responseCredits3.data.result;
            if ( dataCredits3.result ) {
              credits = credits.concat(dataCredits3.result);
            }
          }
          const responseCredits4 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=4&size=20');
          if ( responseCredits4.status == 200 ) {
            const dataCredits4 = responseCredits4.data.result;
            if ( dataCredits4.result ) {
              credits = credits.concat(dataCredits4.result);
            }
          }          
          const responseCredits5 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=5&size=20');
          if ( responseCredits5.status == 200 ) {
            const dataCredits5 = responseCredits5.data.result;
            if ( dataCredits5.result ) {
              credits = credits.concat(dataCredits5.result);
            }
          }          
          const responseCredits6 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=6&size=20');
          if ( responseCredits6.status == 200 ) {
            const dataCredits6 = responseCredits6.data.result;
            if ( dataCredits6.result ) {
              credits = credits.concat(dataCredits6.result);
            }
          }   
          const responseCredits7 = await getHtml(api+'/api/contents/'+data.result[i].code+'/credits?page=7&size=20');
          if ( responseCredits7.status == 200 ) {
            const dataCredits7 = responseCredits7.data.result;
            if ( dataCredits7.result ) {
              credits = credits.concat(dataCredits7.result);
            }
          }             
          
          data.result[i].similars = similars;
          data.result[i].credits = credits;          
        }

        json = json.concat(data.result);

        const fileName = 'parse/pedia_watcha/pedia_watcha_tv_seasons_page_'+page+'.json';
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
    // 왓챠피디아 TV 시리즈 
    const pediaWatchaRes = await getItems();
    console.log('TV 시리즈 총합 : '+pediaWatchaRes.length);

    const fileName = 'parse/pedia_watcha/pedia_watcha_tv_seasons.json';
    fs.writeFileSync(fileName, JSON.stringify(pediaWatchaRes));        
  }
  
  handleAsync();