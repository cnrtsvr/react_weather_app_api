const axios = require('axios');

const baseURL = 'https://api.openweathermap.org/data/2.5/';
const baseParams = {
  appId: process.env.WEATHER_API_KEY,
  units: 'metric'
};

function getData(req, type = 'weather', parser = (res) => res.data) {
  return new Promise((resolve, reject) => {
    if(req.params && req.params.cityName) {
      const url = baseURL + type;
      axios.get(url, {
        params: {
          q: req.params.cityName,
          ...baseParams
        }
      }).then(response => {
        resolve(parser(response));
      }).catch(e => {
        const {response} = e;
        reject({
          error: response.statusText,
          status: response.status
        });
      });
    } else {
      reject({
        error: 'City Name is required',
        status: 422
      });
    }
  });
}

exports.weather = (req) => {
  return getData(req, 'weather', (response) => {
    const {main} = response.data;
    return {
      temp: main.temp
    };
  })
}

exports.forecast = (req) => {
  return getData(req, 'forecast', (response) => {
    const {list} = response.data;
    return {
      list: list.reduce((accumulator, currentItem) => {
        const date = new Date(currentItem.dt * 1000).toISOString().slice(0, 10);
        if(!accumulator[date]) {
          accumulator[date] = currentItem.main.temp;
        }
        return accumulator;
      }, {})
    };
  })
}