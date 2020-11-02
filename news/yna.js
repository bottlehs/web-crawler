/**
 * 연합뉴스 - 스포츠 크롤링
 *
 * @author bottlehs
 * @description 연합뉴스 - 스포츠 크롤링
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
 const office  = '연합뉴스';
 const source = 'https://www.yna.co.kr';
 
 async function getHtml() {
   try {
     return await axios.get(source+"/sports/all");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $("ul.list li").children("div.item-box01").each(function(i, element) {
    const item = {
      title: "", // 제목
      url: "", // 링크
      image_url: "", // 이미지 URL
      image_alt: "", // 이미지 ALT
      summary: "", // 요약글
      date: "", // 날짜
      office: office, // 회사
      source: source // 출처
    };

    item.title = $(this).find('.news-con a.tit-wrap .tit-news').text();
    item.url = $(this).find('.news-con a.tit-wrap').attr('href');
    item.image_url = $(this).find('.img-con a.img img').attr('src');
    item.image_alt = $(this).find('.img-con a.img img').attr('alt');
    item.summary = $(this).find('.news-con p.lead').text();
    item.date = $(this).find('.info-box01 span.txt-time').text();

    items.push(item);
  });   

  return items;
 };
 
 module.exports = { getItems };