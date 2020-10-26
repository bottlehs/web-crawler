/**
 * 과학기술정보통신부 - 사업공고 크롤링
 *
 * @author bottlehs
 * @description 과학기술정보통신부 - 사업공고 크롤링
 *
 */

 /**
  * ResultType : Json
  */
const axios = require("axios");
const cheerio = require("cheerio");
const office  = '과학기술정보통신부';

const getHtml = async () => {
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
};

getHtml()
  .then(response => {
    let urlList = [];
    
    response.data.result.nodes.forEach((item, i) => {
      const files = [];
      for ( var j = 0; j < 100; j++ ) {
        if ( item['file_0'+j] ) {
          files.push(item['file_0'+j]);
        }
      }

      urlList.push({
        title: item.artsubject,
        url: 'https://msit.go.kr/web/msipContents/contentsView.do?cateId=_tstb17&artId='+item.partid,
        date: item.admin_t,
        department: item.admin_p,
        write: item.admin_w,
        files: files,        
        office : office
      });
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));