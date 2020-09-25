require('dotenv').config();
const express = require('express');
const app = express();
const openWeatherController = require('./controller/OpenWeatherController');

app.get('/', (req, res) => {
  res.status(401);
  res.send('Send your request to related endpoint!');
});

app.get('/weather/:cityName?', (req, res) => {
  openWeatherController.weather(req).then(data => {
    res.send(data);
  }).catch(e => {
    res.status(e.status);
    res.send({
      error: e.error
    });
  })
});

app.get('/forecast/:cityName?', (req, res) => {
  openWeatherController.forecast(req).then(data => {
    res.send(data);
  }).catch(e => {
    res.status(e.status);
    res.send({
      error: e.error
    });
  })
});

app.listen(3000, () => {
  console.log('react_weather_app_api listening on port 3000!');
});