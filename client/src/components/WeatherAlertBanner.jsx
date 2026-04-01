import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiCloudRain, FiMapPin, FiLoader, FiShield } from 'react-icons/fi';
import { getBrowserLocation, getCityFromCoords } from '../services/locationService';
import { getLiveWeatherAlert } from '../services/weatherService';

const WeatherAlertBanner = ({ defaultZone }) => {
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [currentZone, setCurrentZone] = useState(defaultZone);

  useEffect(() => {
    const fetchWeatherAndLocation = async () => {
      setLoading(true);
      try {
        // Attempt to get user location
        let lat, lng;
        try {
          const coords = await getBrowserLocation(); // Might fail if simple fallback or no permissions
          lat = coords.lat;
          lng = coords.lng;
          
          if (lat && lng) {
             const zoneName = await getCityFromCoords(lat, lng);
             if (zoneName) setCurrentZone(zoneName);
          }
        } catch (e) {
             console.warn('Could not get precise location, falling back to default zone logic', e);
             setLocationError(true);
             // Default fake coords for demo purposes in case of location failure
             lat = 13.0827; // Chennai
             lng = 80.2707;
        }

        const alert = await getLiveWeatherAlert(lat, lng);
        setAlertData(alert);
      } catch (err) {
         console.error('Failed to fetch weather data:', err);
      }
      setLoading(false);
    };

    fetchWeatherAndLocation();
  }, [defaultZone]);

  if (loading) {
     return (
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '4px solid var(--text-muted)' }}>
           <FiLoader className="spin" size={24} color="var(--text-muted)" />
           <span className="text-subtle">Analyzing live weather and local area conditions...</span>
        </div>
     );
  }

  if (!alertData) return null;

  // Determine styles and icons based on dynamically fetched alert severity
  const isHighRisk = alertData.isHighRisk || alertData.severity === 'WARNING';
  const borderColor = isHighRisk ? 'var(--status-warning)' : 'var(--status-success)';
  const bgColor = isHighRisk ? 'rgba(255, 234, 0, 0.05)' : 'rgba(0, 230, 118, 0.05)';
  const textColor = isHighRisk ? 'var(--status-warning)' : 'var(--status-success)';
  const MainIcon = isHighRisk ? FiAlertTriangle : FiShield;

  return (
    <div className="glass-panel" style={{ borderLeft: `4px solid ${borderColor}`, background: bgColor, marginBottom: '40px', transition: 'all 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
         <MainIcon size={28} color={textColor} style={{ marginTop: '4px'}} />
         <div>
            <h3 style={{ color: textColor, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isHighRisk ? `AI Alert: High Risk Condition Detected` : `AI Monitoring: Conditions Normal`}
            </h3>
            <p className="text-subtle" style={{ marginBottom: '8px', fontSize: '1.05rem' }}>
              We've mapped your location to <strong style={{ color: 'var(--text-main)' }}><FiMapPin style={{ display: "inline", marginBottom: "-2px" }}/> {currentZone}</strong>. 
            </p>
            <p className="text-subtle">
              {locationError && `Location access was denied. Currently simulating for area. `}
              {alertData.description} 
              {isHighRisk && ` Your Standard Plan may not cover full income loss. Consider upgrading to Premium Plan.`}
            </p>
         </div>
      </div>
    </div>
  );
};

export default WeatherAlertBanner;
