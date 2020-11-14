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
 
 async function getHtml() {
   try {
     return await axios.get("https://www.kimst.re.kr/u/rnd/inform_01/pjtAnuc.do");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $(".table.table-list tbody").children("tr").each(function(i, element) {
    const item = {
      title: "", // 제목
      url: "",  // 링크
      date: "",  // 날짜(공고시작일)
      period: "", // 접수기간
      write: "",  // 작성자
      office: office // 소관부처
    };

    $(this).find('td').each(function(j, element) {
      if ( j ==  2 ) {
        // 작성자(담당자)
        item.write = element.children[0].data;
      };
      if ( j ==  3 ) {
        // 날짜(공고시작일)
        item.date = element.children[0].data;
      };      
      if ( j ==  4 ) {
        // 접수기간
        item.period = element.children[0].data;
      };
    });    

    item.title = $(this).find('td.text-left a').text();
    item.url = 'https://www.kimst.re.kr/u/rnd/inform_01/pjtAnuc.do'+$(this).find('td.text-left a').attr('href');      

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
  }
  
  handleAsync();