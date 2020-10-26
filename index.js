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
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("ul.list li").children("div.item-box01");

    $bodyList.each(function(i, elem) {
      ulList[i] = {
        title: $(this).find('.news-con a.tit-wrap .tit-news').text(),
        url: $(this).find('.news-con a.tit-wrap').attr('href'),
        image_url: $(this).find('.img-con a.img img').attr('src'),
        image_alt: $(this).find('.img-con a.img img').attr('alt'),
        summary: $(this).find('.news-con p.lead').text(),
        date: $(this).find('.info-box01 span.txt-time').text()
      };      

      /*
      ulList[i] = {
          title: $(this).find('strong.news-tl a').text(),
          url: $(this).find('strong.news-tl a').attr('href'),
          image_url: $(this).find('p.poto a img').attr('src'),
          image_alt: $(this).find('p.poto a img').attr('alt'),
          summary: $(this).find('p.lead').text().slice(0, -11),
          date: $(this).find('span.p-time').text()
      };
      */
    });

    const data = ulList.filter(n => n.title);
    return data;
  })
  .then(res => console.log(res));