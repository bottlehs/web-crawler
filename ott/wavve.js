/**
 * 과학기술정보통신부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 과학기술정보통신부 - 사업공고 크롤링
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

 let page = 23;
 let limit = 20;
 let isLast = true;
 let broadcastid = 107322;

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
      'subgenre':'vsgm01002',
      'uicode':'VN35',
      'uiparent':'GN56-VN35',
      'uirank':6,
      'uitype':'VN35',
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
      const fileName = 'wavve/wave_'+broadcastid+'_'+page + '.json';
      fs.writeFileSync(fileName, JSON.stringify(data));    

      page++;
    }

    return items;
 };
 
 module.exports = { getItems };

 async function handleAsync() {
  // 넷플릭스
  const netflixRes = await getItems();
  console.log(netflixRes);
}

handleAsync();