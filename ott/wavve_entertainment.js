/**
 * 웨이브 - 예능 크롤링
 *
 * @author bottlehs
 * @description 웨이브 - 예능 크롤링
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

 let note1 = "예능"
 let note2 = "반려동물"
 let page = 1;
 let limit = 20;
 let broadcastid = '108885';
 let isLast = true;

 async function getHtml() {
   try {
    const params = {
      'limit':limit,
      'offset':(page - 1) * limit,
      'page':page,
    }
    // &limit="+params.limit+"&offset="+params.offset+"&page="+params.page+"
    return await axios.get("https://apis.wavve.com/cf/vod/allprograms?WeekDay=all&broadcastid=108885&came=BandView&contenttype=program&genre=02&limit="+params.limit+"&offset="+params.offset+"&page="+params.page+"&orderby=new&subgenre=vsgm02029&uicode=VN59&uiparent=GN57-VN59&uirank=18&uitype=VN59&apikey=E5F3E0D30947AA5440556471321BB6D9&credential=none&device=pc&drm=wm&partner=pooq&pooqzone=none&region=kor&targetage=all", {
      // params: params,
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