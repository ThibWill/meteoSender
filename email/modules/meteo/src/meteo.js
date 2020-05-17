const axios = require("axios");
const moment = require("moment");
const config = require("../config/config.json");
const mapweather = require("../maps/mapweather.json");

async function buildMail() {
  let meteoHTML = false;
  await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Mulhouse&appid=${config.openweather.apiKey}`)
    .then(async (response) => {
      meteoHTML = await createEmail(response.data);
    })
    .catch(async (error) => {
      // SAVE LOGS
      console.log(error);
    }
  )
  return meteoHTML;
}

async function createEmail(informations) {
  // TODO Inprove the email
  try {
    const city = informations.city;
    const weather0 = informations.list[0];
    const weather3h = informations.list[1];
    const weather6h = informations.list[2];
    const weather9h = informations.list[3];
    const weather12h = informations.list[4];
    let content = '';
    content += `<div style='width:600px;'>`
    content += `<h1 style='font-size:28px; margin-left:32px; margin-right:32px;'>Prévisions météo pour ${city.name}</h1>`
    content += `<article style='font-size:20px; margin-left:32px; margin-right:32px;'>`
    content +=   `<p>Temps actuel : ${weather0.weather[0].description} ${mapweather[weather0.weather[0].icon]}<br/>`
    content +=   `Vent actuel : ${weather0.wind.speed}m/s</p>`
    content +=   `<p>Prévisions :<br/>`
    content +=   ` - dans 3 heures : ${weather3h.weather[0].description} ${mapweather[weather3h.weather[0].icon]}<br/>`
    content +=   ` - dans 6 heures : ${weather6h.weather[0].description} ${mapweather[weather6h.weather[0].icon]}<br/>`
    content +=   ` - dans 9 heures : ${weather9h.weather[0].description} ${mapweather[weather9h.weather[0].icon]}<br/>`
    content +=   ` - dans 12 heures : ${weather12h.weather[0].description} ${mapweather[weather12h.weather[0].icon]}</p>`
    content +=   `<p>Lever du soleil :  ${moment(city.sunset).hour()}h${moment(city.sunset).minute()}<br/>`
    content +=   `Coucher du soleil :  ${moment(city.sunset).hour()}h${moment(city.sunset).minute()}</p>`
    content += `</article>`;
    content += `</div>`;
    return content;
  } catch(e) {
    console.log(e);
    return false;
  }
} 

module.exports = {
  buildMail,
}


//TODO
async function windCategory() {
  /* 0 	<1 	Calm 	Light Wind 	Small wavelets
 1 	1-5 	Light Air 	Light Wind 	Small wavelets
 2 	6-11 	Light Breeze 	Light Wind 	Small wavelets
 3 	12-19 	Gentle Breeze 	Gentle-moderate 	Large wavelets to small waves
 4 	20-28 	Moderate Breeze 	Gentle-moderate 	Large wavelets to small waves
 5 	29-38 	Fresh Breeze 	Fresh wind 	Moderate waves, many whitecaps
 6 	39-49 	Strong gale 	Strong wind 	Large waves, many whitecaps
 7 	50-61 	Fresh Breeze 	Strong wind 	Large waves, many whitecaps
 8 	62-74 	Fresh gale 	Gale 	High waves, foam streaks
 9 	75-88 	Stong gale 	Gale 	High waves, foam streaks
 10 	89-102 	Whole gale 	Whole gale 	Very high waves, rolling sea
 11 	103-117 	Storm 	Whole gale 	Very high waves, rolling sea
 12-17 	>117 	Hurricane 	Hurricane 	Sea white with spray and foam*/
 }