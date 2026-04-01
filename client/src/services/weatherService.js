import axios from 'axios';

/**
 * Fetch current weather from OpenWeatherMap API
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<Object>} Formatted weather data and alert status
 */
export const getLiveWeatherAlert = async (lat, lng) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  
  if (!apiKey) {
    console.warn('VITE_WEATHER_API_KEY is not defined. Falling back to mock weather data.');
    // Simulated mock weather alert logic if no APi key is provided
    return {
      severity: 'WARNING',
      condition: 'Heavy Rain',
      description: 'Mock data: Severe rain expected in your location',
      isHighRisk: true,
      temp: 28
    };
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const result = response.data;
    const weatherMain = result.weather[0].main; // e.g., 'Rain', 'Clear', 'Extreme'
    
    let isHighRisk = false;
    let severity = 'INFO';
    
    // Simple criteria for high risk: Rain, Thunderstorm, Snow, or Extreme Temp
    if (['Thunderstorm', 'Rain', 'Snow', 'Tornado', 'Squall', 'Ash'].includes(weatherMain) || result.main.temp > 40 || result.main.temp < 0) {
      isHighRisk = true;
      severity = 'WARNING';
    }

    return {
      severity,
      condition: result.weather[0].description,
      description: `Live weather data indicates ${result.weather[0].description}. ${isHighRisk ? 'This is considered a high-risk condition.' : 'Conditions are normal.'}`,
      isHighRisk,
      temp: result.main.temp,
      raw: result
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return a safe default
    return {
      severity: 'INFO',
      condition: 'Unknown',
      description: 'Could not retrieve live weather data at this time.',
      isHighRisk: false,
      temp: null
    };
  }
};
