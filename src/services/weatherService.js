const axios = require('axios');

const getWeatherByCoords = async (latitude, longitude) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY não configurada. Pulando integração de clima.');
    return null;
  }

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: 'metric',
          lang: 'pt_br',
        },
        timeout: 5000,
      }
    );

    const { weather, main, wind, sys } = response.data;

    return {
      description: weather[0]?.description,
      temperature: main?.temp,
      feelsLike: main?.feels_like,
      humidity: main?.humidity,
      windSpeed: wind?.speed,
      country: sys?.country,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Erro ao buscar dados climáticos:', err.message);
    return null;
  }
};

module.exports = { getWeatherByCoords };