/**
 * 조달청 - 국내지원사업 크롤링
 *
 * @author bottlehs
 * @description 조달청 국내지원사업 크롤링
 *
 */

  /**
  * ResultType : HTML
  */
const axios = require("axios");
const cheerio = require("cheerio");
const office  = '중소기업벤처부';

const getHtml = async () => {
  try {
    return await axios.get("https://www.pps.go.kr/gpass/domestic/listDomestic.do");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(response => {
    let urlList = [];
    const $ = cheerio.load(response.data);
    const $bodyList = $("table.tstyle_list tbody").children("tr");

    let type = ''; // 구분
    let title = ''; // 공고명
    let period = ''; // 신청기간
    let people = ''; // 신청인원/모집인원
    let state = ''; // 진행상태
    $bodyList.each(function(i, element) {
      $(this).find('td').each(function(j, element) {
        if ( element.children[0].data ) {
          if ( j == 1 ) {
            // 구분
            type = element.children[0].data.trim();
          };

          if ( j == 3 ) {
            // 기간
            period = element.children[0].data.trim() +' '+ element.children[2].data.trim();            
          };

          if ( j == 4 ) {
            // 신청인원/모집인원
            people = element.children[0].data.trim();                        
          };          

          if ( j == 5 ) {
            // 진행상태
            state = element.children[0].data.trim();                                    
          };          
        };
      });

      title = $(this).find('td a').text().trim();

      urlList[i] = {
        type: type,    
        title: title,
        period: period,
        people: people,
        state: state
      };      
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));