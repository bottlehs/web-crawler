/**
 * 환경부 - 사업공고 크롤링 
 *
 * @author bottlehs
 * @description 환경부 - 사업공고 크롤링
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
 const office  = '환경부';
 
 async function getHtml() {
   try {
     return await axios.get("https://me.go.kr/home/web/index.do?menuId=290");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);
  
   $(".table_case01 tbody").children("tr").each(function(i, element) {
     const item = {
       title: '', // 제목
       department: '', // 담당부서
       write: '', // 등록자
       regDate: '', // 등록일
       hit: '', // 조회수
       url: '', // 링크
       office: office // 소관부처
     };

      $(this).find('td').each(function(j, element) {
        console.log(j+':'+element.children[0].data);
        if ( j == 2 ) {
          // 담당부서
          item.department = element.children[0].data.trim();
        }
        if ( j == 3 ) {
          // 작성자
          item.write = element.children[0].data.trim();
        }        

        if ( j == 4 ) {
          // 등록일
          item.regDate = element.children[0].data.trim();
        }        

        if ( j == 5 ) {
          // 조회수
          item.hit = element.children[0].data.trim();
        }                
      });     

     // 제목
     item.title = $(this).find('.al a').text().trim();

     // 링크 
     item.url = 'https://me.go.kr/' + $(this).find('.al a').attr('href');     

     items.push(item);
   });
 
   return items;
 };
 
 module.exports = { getItems };