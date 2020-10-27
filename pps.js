/**
 * 조달청 - 국내지원사업 크롤링
 *
 * @author bottlehs
 * @description 조달청 국내지원사업 크롤링
 *
 */

 /**
  * @todo
  * 1. 링크 접근을 못하도록 되어 있음, java 세션으로 상세보기 관리하기 때문에 상세보기 링크가 존재 하지 않음 공지사항에서 유사 링크는 찾을수 있으므로 알아 볼것
  */

  /**
  * ResultType : HTML
  */
const axios = require("axios");
const cheerio = require("cheerio");
const office  = '조달청';

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
    let url = ''; // 링크
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

      // 링크 ( pre-link )
      let temp = $(this).find('td a').attr('href');     
      temp = temp.split(',')[0];
      var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
      temp = temp.replace("javascript:fn_detailView","");
      temp = temp.replace(reg, "");
      console.log(temp);

      urlList[i] = {
        type: type,    
        title: title,
        period: period,
        people: people,
        state: state,
        url: url,
        office : office
      };      
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));