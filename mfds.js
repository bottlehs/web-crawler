/**
 * 식품의약품안전처 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 식품의약품안전처 - 사업공고 크롤링
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
 const office  = '식품의약품안전처';
 
 async function getHtml() {
   try {
     return await axios.get("https://www.mfds.go.kr/brd/m_76/list.do");
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
   let items = [];
   const response = await getHtml();
   const $ = cheerio.load(response.data);

   $(".bbs_list01 ul:not(.list_notice)").children("li").each(function(i, element) {
    const item = {
      title: "", // 제목
      url: "",  // 링크
      department: "",  // 담당부서 
      hit: "", // 조회수
      files: [],
      office: office // 소관부처
    };

    item.title = $(this).find('div.center_column a.title').text();
    item.title = item.title.replace(/\n/g, "");
    item.title = item.title.replace(/\t/g, "");
    item.title = item.title.trim();
    if ( 0 < item.title.length ) {
      item.url = 'https://www.mfds.go.kr/brd/m_76/'+$(this).find('div.center_column a').attr('href').substr(2);
      $(this).find('div.center_column .winfo p').each(function(j, element) {
        if ( j ==  0 ) {
          // 담당부서
          let temp = element.children[0].data.split('|');
          item.department = temp[1].trim();
        };        
        if ( j ==  1 ) {
          // 조회수
          let temp = element.children[0].data.split('|');
          item.hit = temp[1].trim();
        };        
      });

      item.files.push({
        name : $(this).find('div.center_column .bbs_file_list .bbs_file_list_header span').text(),
        url : 'https://www.mfds.go.kr/brd/m_76/'+$(this).find('div.center_column .bbs_file_list .bbs_file_list_icons a.bbs_icon_filedown').attr('href').substr(2)
      });
      items.push(item);            
    }
  });   

  return items;
 };
 
 module.exports = { getItems };
