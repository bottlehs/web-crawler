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
  * @issue
  */

  /**
  * ResultType : HTML
  */
const axios = require("axios");
const cheerio = require("cheerio");
const office  = '산업통상자원부';

async function getHtml() {
  try {
    return await axios.get("https://www.motie.go.kr/motie/ne/announce2/bbs/bbsList.do?bbs_cd_n=6");
  } catch (error) {
    console.error(error);
  }
}

async function getItems() {
  let items = [];
  const response = await getHtml();
  const $ = cheerio.load(response.data);

  $("table.listTable01 tbody").children("tr").each(function(i, element) {
    const item = {
      title: '', // 제목
      department: '', // 담당부서
      regDate: '', // 등록일
      hit: '', // 조회수
      file: '', // 첨부파일
      url: '', // 링크
      office: office // 소관부처
    };

    $(this).find('td').each(function(j, element) {
      if ( element.children[0].data ) {
        if ( j == 2 ) {
          // 담당부서
          item.department = element.children[0].data.trim();
        }
        if ( j == 3 ) {
          // 등록일
          item.regDate = element.children[0].data.trim();
        }          
        if ( j == 4 ) {
          // 조회수
          item.hit = element.children[0].data.trim();
        }          
      }        
    });

    // 제목
    item.title = $(this).find('.al .ellipsis a').text().trim();

    // 링크 
    item.url = 'https://www.motie.go.kr/motie/ne/announce2/bbs/' + $(this).find('.al .ellipsis a').attr('href');     

    // 파일
    item.file =['https://www.motie.go.kr/'+$(this).find('.file a').attr('href')];

    items.push(item);
  });

  return items;
};

module.exports = { getItems };