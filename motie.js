/**
 * 산업통상자원부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 산업통상자원부 - 사업공고 크롤링
 *
 */

 /**
  * @todo
  */

  /**
  * ResultType : HTML
  */
const axios = require("axios");
const cheerio = require("cheerio");
const office  = '산업통상자원부';

const getHtml = async () => {
  try {
    return await axios.get("https://www.motie.go.kr/motie/ne/announce2/bbs/bbsList.do?bbs_cd_n=6");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(response => {
    let urlList = [];
    const $ = cheerio.load(response.data);
    const $bodyList = $("table.listTable01 tbody").children("tr");

    let title = ''; // 제목
    let department = ''; // 담당부서
    let regDate = ''; // 등록일
    let hit = ''; // 조회수
    let file = ''; // 첨부파일
    let url = ''; // 링크
    $bodyList.each(function(i, element) {
      $(this).find('td').each(function(j, element) {
        if ( element.children[0].data ) {
          if ( j == 2 ) {
            // 담당부서
            department = element.children[0].data.trim();
          }
          if ( j == 3 ) {
            // 등록일
            regDate = element.children[0].data.trim();
          }          
          if ( j == 4 ) {
            // 조회수
            hit = element.children[0].data.trim();
          }          
        }        
      });

      // 제목
      title = $(this).find('.al .ellipsis a').text().trim();

      // 링크 
      url = 'https://www.motie.go.kr/motie/ne/announce2/bbs/' + $(this).find('.al .ellipsis a').attr('href');     

      // 파일
      file =['https://www.motie.go.kr/'+$(this).find('.file a').attr('href')];

      urlList[i] = {
        title: title, // 제목
        department : department, // 담당부서
        regDate: regDate, // 등록일
        hit: hit, // 조회수
        file: file, // 첨부파일
        url: url, // 링크
        office : office
      };   
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));