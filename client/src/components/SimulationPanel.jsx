import React, { useState } from 'react';
import axios from 'axios';
import { FiPlay, FiAlertTriangle, FiCloudRain, FiThermometer, FiMapPin, FiCrosshair } from 'react-icons/fi';

const SimulationPanel = ({ token, fetchMetrics }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const simulateEvent = async (type, severity, fraudScenario = false) => {
    setLoading(true);
    setResult(null);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post('/api/simulation/trigger', {
        type, 
        zone: 'T. Nagar', // defaulting for demo
        severity,
        fraudScenario
      }, config);
      
      setResult(data);
      if(fetchMetrics) fetchMetrics();
    } catch (error) {
      alert("Error triggering simulation");
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel" style={{ height: '100%' }}>
      <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
         <FiPlay color="var(--accent-purple)"/> API Mock Simulation Panel (Hackathon demo)
      </h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={() => simulateEvent('Heavy Rain', 'Severe')} disabled={loading}>
          <FiCloudRain style={{ marginRight: '8px' }}/> Sim Heavy Rain (T. Nagar)
        </button>
        <button className="btn btn-outline" onClick={() => simulateEvent('Extreme Heat', 'Extreme')} disabled={loading}>
          <FiThermometer style={{ marginRight: '8px' }}/> Sim Heat Spike (T. Nagar)
        </button>
        <button className="btn btn-outline" onClick={() => simulateEvent('Traffic Gridlock', 'Severe')} disabled={loading}>
          <FiMapPin style={{ marginRight: '8px' }}/> Sim Traffic (T. Nagar)
        </button>
      </div>

      <div style={{ padding: '16px', background: 'rgba(255, 23, 68, 0.05)', borderLeft: '4px solid var(--status-error)', borderRadius: '8px', marginBottom: '24px' }}>
         <h4 style={{ color: 'var(--status-error)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FiCrosshair /> Fraud Testing
         </h4>
         <p className="text-subtle" style={{ marginBottom: '16px' }}>Inject a "GPS Mismatch" or "Repeated Claim" behavior to test the Fraud AI.</p>
         <button className="btn btn-premium" onClick={() => simulateEvent('Heavy Rain', 'Moderate', true)} disabled={loading}>
            Simulate Fraudulent Claim Attempt
         </button>
      </div>

      {result && (
        <div style={{ padding: '16px', background: 'var(--bg-panel-solid)', borderRadius: '8px' }}>
          <h4>Simulation Result</h4>
          <p className="text-subtle" style={{ margin: '8px 0' }}>{result.message}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
             <span>Workers Evaluated:</span> <strong>{result.workersAffected}</strong>
          </div>
          {result.results.length > 0 && result.results.map((res, i) => (
             <div key={i} style={{ padding: '12px', background: 'var(--bg-input)', borderRadius: '4px', marginBottom: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                   <strong>worker: {res.worker}</strong>
                   <span className={`badge badge-${res.evalResult.finalStatus === 'Rejected' ? 'error' : (res.evalResult.finalStatus === 'Auto-Paid' ? 'success' : 'warning')}`}>
                     {res.evalResult.finalStatus}
                   </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                   <span>Confidence: {res.evalResult.fraudDetails.confidenceScore}%</span>
                   <span>Payout: ₹{res.evalResult.payout.finalPayoutAmount || 0}</span>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
