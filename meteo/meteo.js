const moment = require("moment");
const axios = require("axios");
const config = require("./config/config.json");
const mapweather = require("./maps/mapweather.json");

// A cronjob is better for this
async function checkTime() {
  const currentDate = moment();
  const currentHour = currentDate.hour();
  if(currentHour === 9) {
    weather();
  }
}

async function weather() {
  await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=Mulhouse&appid=${config.openweather.apiKey}`)
    .then(async (response) => {
      const email = await createEmail(response.data);
      sendEmail(email);
    })
    .catch(async (error) => {
      // SAVE LOGS
      console.log(error);
    }
  )
}

async function createEmail(informations) {
  // TODO Inprove the email
  try {
    const subjectEmail= "☀️ Meteo of the day! ☁️";
    const city = informations.city;
    const weather0 = informations.list[0];
    const weather3h = informations.list[1];
    const weather6h = informations.list[2];
    const weather9h = informations.list[3];
    const weather12h = informations.list[4];
    const content = 
     `<h1>Hello Thibault ✌️</h1>
      <div>
        <h2>Here is your weather report of the day</h2>
        <p>Location: ${city.name}</p>
        <p>Sunrise at ${moment(city.sunrise).hour()}:${moment(city.sunrise).minute()}</p>
        <p>Sunset at ${moment(city.sunset).hour()}:${moment(city.sunset).minute()}</p>
      </div>
      <div>
        <p>The actual weather is: ${weather0.weather[0].description} ${mapweather[weather0.weather[0].icon]}</p>
        <p>Wind : ${weather0.wind.speed}m/s</p>
        <p>Previsions : </p>
        <p>- In 3 hours : ${weather3h.weather[0].description} ${mapweather[weather3h.weather[0].icon]}</p>
        <p>- In 6 hours : ${weather6h.weather[0].description} ${mapweather[weather6h.weather[0].icon]}</p>
        <p>- In 9 hours : ${weather9h.weather[0].description} ${mapweather[weather9h.weather[0].icon]}</p>
        <p>- In 12 hours : ${weather12h.weather[0].description} ${mapweather[weather12h.weather[0].icon]}</p>
      </div>`;
    return { subjectEmail, content };
  } catch(e) {
    return `A problem occured when building the weather email`;
  }
} 

async function sendEmail(email) {
  await axios.post('http://gmailapi/sendEmail', { email,
    }).then(async (response) => {
      // SAVE LOGS
      console.log("mail sended to api!");
    })
    .catch(async (error) => {
      // SAVE LOGS
      console.log(error);
    }
  )
}

setInterval(checkTime, 60 * 60 * 1000);

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