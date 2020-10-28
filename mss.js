/**
 * 중소기업벤처부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 중소기업벤처부 - 사업공고 크롤링
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
 const office  = '중소기업벤처부';
 
 async function getHtml() {
   try {
     return await axios.get("https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $(".board_list.type_notice table tbody").children("tr.notice").each(function(i, element) {

    const item = {
      title: "", // 제목
      url: "",  // 링크
      date: "",  // 날짜
      department: "",  // 부서
      office: office // 소관부처
    };

    $(this).find('td.mobile div.info ul li span').each(function(j, element) {
      if ( j == 1 ) {
        item.department = element.children[0].data;
      };
      if ( j == 3 ) {
        item.date = element.children[0].data;
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

    item.url = 'https://www.mss.go.kr/site/smba/ex/bbs/View.do?cbIdx='+tempArray[0]+'&bcIdx='+tempArray[1]+'&parentSeq='+tempArray[3];
    item.title = $(this).find('td.mobile div.subject strong').text(),
    items.push(item);
  });   

  return items;
 };
 
 module.exports = { getItems };