/**
 * 중소기업벤처부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 중소기업벤처부 사업공고 크롤링
 *
 */

const axios = require("axios");
const cheerio = require("cheerio");
const office  = '중소기업벤처부';

const getHtml = async () => {
  try {
    return await axios.get("https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(response => {
    let urlList = [];
    const $ = cheerio.load(response.data);
    const $bodyList = $(".board_list.type_notice table tbody").children("tr.notice");

    $bodyList.each(function(i, element) {
      // https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx=310&bcIdx=1022229&parentSeq=1022229

      // 담당부서, 등록일 추출
      let date = '';
      let department = '';
      let url = '';
      $(this).find('td.mobile div.info ul li span').each(function(j, element) {
        if ( j == 1 ) {
          department = element.children[0].data;
        };
        if ( j == 3 ) {
          date = element.children[0].data;
        };       
      });

      // URL 추출
      let temp = $(this).find('td.mobile a').attr('onclick');
      var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
      temp = temp.replace("doBbsFView('","");
      temp = temp.replace("');return false;","");
      let tempArray = temp.split(',');
      tempArray.forEach((item, j) => {
        item = item.replace(reg, "");
        tempArray[j] = item;
      });

      url = 'https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx='+tempArray[0]+'&bcIdx='+tempArray[1]+'&parentSeq='+tempArray[3];

      urlList[i] = {
        title: $(this).find('td.mobile div.subject strong').text(),
        url: url,
        date: date,
        department: department,
        office : office
      };      
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));