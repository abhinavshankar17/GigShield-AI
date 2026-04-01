import axios from 'axios';

/**
 * Get current browser location using HTML5 Geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

/**
 * Reverse geocodes coordinates to get the city/zone using Google Maps API
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<string>} city or zone name
 */
export const getCityFromCoords = async (lat, lng) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('VITE_GOOGLE_MAPS_API_KEY is not defined. Falling back to simple coordinates mapping.');
    // Fallback: If no API key, we just return a mock zone name for demo purposes, or coordinates string
    return `Zone (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.results && response.data.results.length > 0) {
      // Find locality or sublocality
      const result = response.data.results.find(res => res.types.includes('locality')) || response.data.results[0];
      const cityComponent = result.address_components.find(comp => comp.types.includes('locality') || comp.types.includes('sublocality'));
      return cityComponent ? cityComponent.long_name : result.formatted_address.split(',')[0];
    }
    return 'Unknown Zone';
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return 'Unknown Zone';
  }
};
