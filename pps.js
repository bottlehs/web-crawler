/**
 * 조달청 - 국내지원사업 크롤링
 *
 * @author bottlehs
 * @description 조달청 - 국내지원사업 크롤링
 */

 /**
  * @todo
  */

 /**
  * @issue
  * url 존재하지 않음 ( Spring cookie 로 페이지 상세보기 구현됨 )
  */

  /**
  * ResultType : HTML
  */
 const axios = require("axios");
 const cheerio = require("cheerio");
 const office  = '조달청';
 
 async function getHtml() {
   try {
     return await axios.get("https://www.pps.go.kr/gpass/domestic/listDomestic.do");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $("table.tstyle_list tbody").children("tr").each(function(i, element) {
      const item = {
        type: '', // 구분
        title: '', // 공고명
        period: '', // 신청기간
        people: '', // 신청인원/모집인원
        state: '', // 진행상태
        url: '', // 링크    
        office: office // 소관부처      
      };

      $(this).find('td').each(function(j, element) {
        if ( element.children[0].data ) {
          if ( j == 1 ) {
            // 구분
            item.type = element.children[0].data.trim();
          };

          if ( j == 3 ) {
            // 기간
            item.period = element.children[0].data.trim() +' '+ element.children[2].data.trim();            
          };

          if ( j == 4 ) {
            // 신청인원/모집인원
            item.people = element.children[0].data.trim();                        
          };          

          if ( j == 5 ) {
            // 진행상태
            item.state = element.children[0].data.trim();                                    
          };          
        };
      });

      item.title = $(this).find('td a').text().trim();

      // 링크 ( pre-link )
      let temp = $(this).find('td a').attr('href');     
      temp = temp.split(',')[0];
      var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
      temp = temp.replace("javascript:fn_detailView","");
      temp = temp.replace(reg, "");

      items.push(item);
    });

    return items;
 };
 
 module.exports = { getItems };