/**
 * 과학기술정보통신부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 과학기술정보통신부 - 사업공고 크롤링
 *
 */

 /**
  * @todo
  */

 /**
  * @issue
  */  

  /**
  * ResultType : Json
  */
 const axios = require("axios");
 const office  = '과학기술정보통신부';
 
 async function getHtml() {
   try {
    const params = {
      // 'callback': 'jQuery1800673946478618995_1603708369345',
      'search': 'creday<=20201026-19200',
      'sort': 'operday=desc&&idx=desc',
      'below': false,
      'catids': '',
      'index': '',
      'fields': '',
      'pageout': true,
      'aradon.result.format': 'json',
      'aradon.page.pageNo': 1,
      'aradon.page.listNum': 10,
      'aradon.page.screenCount': 5,
      'aradon.referrer.href': 'https://msit.go.kr/web/msipContents/contents.do?mId=MTAzNQ==',
    }

    return await axios.get("https://www.msit.go.kr/dynamic/article/_tstb17", {
      params: params,
    });
   } catch (error) {
     console.error(error);
   }
 }
 
 async function getItems() {
    let items = [];
    const response = await getHtml();

    response.data.result.nodes.forEach((item, i) => {
      const files = [];
      for ( var j = 0; j < 100; j++ ) {
        if ( item['file_0'+j] ) {
          files.push({
            name : '첨부파일' + (j+1),
            url : item['file_0'+j]
          });
        }
      }

      items.push({
        title: item.artsubject, // 제목
        url: 'https://msit.go.kr/web/msipContents/contentsView.do?cateId=_tstb17&artId='+item.partid, // 링크
        date: item.admin_t, // 날짜
        department: item.admin_p, // 부서
        write: item.admin_w, // 작성자
        files: files, // 파일
        office : office // 소관부처
      });
    });

    return items;
 };
 
 module.exports = { getItems };