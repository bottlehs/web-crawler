/**
 * 게임박스 - 크롤링
 *
 * @author bottlehs
 * @description 게임박스 - 크롤링
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
 const office  = '유플러스-지포스나우';
 const source = 'https://www.uplus.co.kr';
 const fs = require('fs');
 let items = [];
 let page = 1;
 let isLast = true;

 async function getHtml() {
   page = items.length + 1;

   try {
     return await axios.post(source+"/ent/gfn/GeforceNowInfo.hpi",{
      devonTargetRow: page,
      devonOrderBy: "",
      schKeywordText: "",
     });
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   /*
   while (isLast) {

   };
   */

   const response = await getHtml();
   const $ = cheerio.load(response.data);
   // console.log(response.data);
   $(".Gforcont02 li").each(function(i, element) {
    const item = {
      price: $(element).find('span').text(), // 가격
      title: $(element).find('.btxt').text(),  // 타이틀
      platform: $(element).find('stxt').text(), // 플랫폼
      img: $(element).find('img').attr('src'), // 이미지
      office: office // 출처
    };
    console.log($(".Gforcont02 li").length());
    if ( $(".Gforcont02 li").length() == 0 ) {
      isLast = false;
    };
    isLast = false; 
    items.push(item);    
   });   

  return items;
 };
 
 module.exports = { getItems };

  // 개별실행
  async function handleAsync() {
    // 게임박스
    const wavveRes = await getItems();
    console.log(wavveRes);

    const fileName = 'uplus/GeforceNow.json';
    fs.writeFileSync(fileName, JSON.stringify(wavveRes));            
  }
  
  handleAsync();