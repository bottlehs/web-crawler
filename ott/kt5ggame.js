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
 const office  = '게임박스';
 const source = 'https://www.kt5ggame.com';
 const fs = require('fs');
 
 async function getHtml() {
   try {
     return await axios.get(source+"/w/game/main.asp");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $(".innerCont").each(function(i, element) {
    const item = {
      category: $(element).find('.category').text(), // 카테고리
      title: $(element).find('.infoTit').text(),  // 타이틀
      production: $(element).find('.pubInfo span:nth-child(2)').text(), // 제작사
      date: $(element).find('.pubInfo span:nth-child(4)').text(),  // 발매일
      description: $(element).find('.pubInfo + span').text(), // 설명
      url: source+$(element).find('.btnGuide').attr('href'),  // 링크
      img: source+$(element).find('.bimg img').attr('src'), // 이미지
      office: office // 출처
    };

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

    const fileName = 'kt5ggame/kt5ggame.json';
    fs.writeFileSync(fileName, JSON.stringify(wavveRes));            
  }
  
  handleAsync();