/**
 * 웨이브 - 영화 크롤링
 *
 * @author bottlehs
 * @description 웨이브 - 영화 크롤링
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

 let note1 = "오리지널"
 let note2 = "예능"
 let page = 1;
 let limit = 20;
 let broadcastid = 'GN13_EN398_pc_none_none';
 let isLast = true;

 async function getHtml() {
   try {
    const params = {
      'limit':limit,
      'offset':(page - 1) * limit,
      'page':page,
    }
    // &limit="+params.limit+"&offset="+params.offset+"&page="+params.page+"
    return await axios.get("https://apis.wavve.com/cf/themes/398?WeekDay=all&broadcastid=GN13_EN398_pc_none_none&came=BandView&contenttype=x&limit="+params.limit+"&offset="+params.offset+"&page="+params.page+"&uicode=EN398&uiparent=GN13-EN398&uirank=5&uitype=EN398&apikey=E5F3E0D30947AA5440556471321BB6D9&credential=none&device=pc&drm=wm&partner=pooq&pooqzone=none&region=kor&targetage=all", {
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