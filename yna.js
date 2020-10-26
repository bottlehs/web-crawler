const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
  try {
    return await axios.get("https://www.yna.co.kr/sports/all");
  } catch (error) {
    console.error(error);
  }
};

getHtml()
  .then(html => {
    let urlList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("ul.list li").children("div.item-box01");

    $bodyList.each(function(i, element) {
      urlList[i] = {
        title: $(this).find('.news-con a.tit-wrap .tit-news').text(),
        url: $(this).find('.news-con a.tit-wrap').attr('href'),
        image_url: $(this).find('.img-con a.img img').attr('src'),
        image_alt: $(this).find('.img-con a.img img').attr('alt'),
        summary: $(this).find('.news-con p.lead').text(),
        date: $(this).find('.info-box01 span.txt-time').text()
      };      
    });

    const data = urlList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));