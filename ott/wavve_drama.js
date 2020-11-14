/**
 * 웨이브 - 드라마 크롤링
 *
 * @author bottlehs
 * @description 웨이브 - 드라마 크롤링
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
 const office  = '웨이브';
 const fs = require('fs');

 let note1 = "드라마"
 let note2 = "웹드라마"
 let page = 1;
 let limit = 20;
 let isLast = true;
 let broadcastid = 109480;
 let subgenre = 'vsgm01009';
 let uicode = 'VN42';
 let uiparent = 'GN56-VN42';
 let uirank = 20;
 let uitype = 'VN42'; 

 async function getHtml() {
   try {
    const params = {
      'WeekDay':'all',
      'adult':'n',
      'broadcastid':broadcastid,
      'came':'BandView',
      'contenttype':'program',
      'genre':'01',
      'limit':limit,
      'offset':(page - 1) * limit,
      'orderby':'viewtime',
      'page':page,
      'subgenre':subgenre,
      'uicode':uicode,
      'uiparent':uiparent,
      'uirank':uirank,
      'uitype':uitype,
      'apikey':'E5F3E0D30947AA5440556471321BB6D9',
      'credential':'none',
      'device':'pc',
      'drm':'wm',
      'partner':'pooq',
      'pooqzone':'none',
      'region':'kor',
      'targetage':'all'      
    }

    return await axios.get("https://apis.wavve.com/cf/vod/allprograms", {
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
  
      console.log(data.cell_toplist.celllist.length);
      if ( data.cell_toplist.celllist.length === 0 ) {
        isLast = false;
      }
  
      // let data = JSON.stringify(response.data);
      const fileName = 'wavve/wave_'+note1+'_'+note2+'_'+broadcastid+'_'+page + '.json';
      fs.writeFileSync(fileName, JSON.stringify(data));    

      page++;
    }

    return items;
 };
 
 module.exports = { getItems };

 // 개별실행
 async function handleAsync() {
  // 웨이브
  const wavveRes = await getItems();
  console.log(wavveRes);
}

handleAsync();