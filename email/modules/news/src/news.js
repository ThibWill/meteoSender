const axios = require("axios");
const config = require("../config/config.json");

async function getNews() {
  let articles;
  await axios.get(`https://newsapi.org/v2/top-headlines?pageSize=5&country=fr&apiKey=${config.newsapi.apiKey}`)
    .then((response) => {
      const data = response.data;
      if(data.status === "ok") {
        const nbResults = data.totalResults > 4 ? 3 : data.totalResults;
        articles = data.articles.slice(0, nbResults);
      } else {
        console.error("newsapi KO");
        articles = null;
      }
    })
    .catch((e)  =>  {
      console.error(e)
      articles = null;
    }) 
    return articles;
}

async function createNews(news) {
  let newsHTML = '';
  newsHTML += `<article style='margin-left:32px; margin-right:32px; width:536px;'>`
  newsHTML +=   `<h3 style='font-size:20px;'>${news.title}</h3>`;
  newsHTML +=   `<div style='display:flex;'>`;
  newsHTML +=     `<img style='width:160px; margin-right:16px;' src='${news.urlToImage}'/>`;
  newsHTML +=     `<p style='width:360px; font-size:12px;'>${news.description !== ''? news.description : news.content}</p>`;
  newsHTML +=   `</div>`;
  newsHTML += `</article>`; 

  return newsHTML; 
} 

async function buildMail() {
  const news = await getNews();
  if(news) {
    let email = `<div style='width:600px;'><h2 style='font-size:28px; margin-left:32px; margin-right:32px;'>Informations du jour</h2>`;
    for(let i = 0; i < news.length; i++) {
      if(news[i].title && news[i].title !== '' && news[i].urlToImage && news[i].urlToImage !== '' 
      && (news[i].description && news[i].description !== '' || news[i].content && news[i].content !== '')) {
        email += await createNews(news[i])
      }
    }
    email += `</div>`;
    return email;
  } 
  return false;
}

module.exports = {
  buildMail
}

