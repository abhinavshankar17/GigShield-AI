import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';

const OnboardingPage = () => {
  const { user, updateUserPolicy } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [plansRes, recRes] = await Promise.all([
          axios.get('/api/policy', config),
          axios.get('/api/policy/recommendation', config)
        ]);
        setPlans(plansRes.data);
        setRecommendation(recRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching onboarding data", error);
        setLoading(false);
      }
    };
    if (user?.token) fetchData();
  }, [user]);

  const handleBuy = async (policyId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/policy/buy', { policyId }, config);
      updateUserPolicy(data); // update context
      navigate('/dashboard');
    } catch (error) {
      alert("Failed to purchase plan");
    }
  };

  if (loading) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Loading Plans...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      
      {/* AI Recommendation Panel */}
      {recommendation && (
        <div className="glass-panel" style={{ marginBottom: '40px', background: 'linear-gradient(135deg, rgba(122, 40, 255, 0.1) 0%, rgba(0, 210, 255, 0.1) 100%)', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <FiShield size={24} color="var(--accent-blue)" style={{ marginRight: '12px' }}/>
            <h2 className="text-gradient">AI Recommendation</h2>
          </div>
          <p style={{ marginBottom: '16px' }}>{recommendation.reasoningSummary}</p>
          <div style={{ display: 'flex', gap: '16px' }}>
             <div className="badge badge-info">Zone Risk: {recommendation.riskLevel} Risk</div>
             <div className="badge badge-success">Suggested: {recommendation.recommendedPlan}</div>
          </div>
        </div>
      )}

      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Select Your Weekly Policy</h2>
      
      <div className="grid-auto">
        {plans.map(plan => (
          <div key={plan._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {recommendation?.recommendedPlan === plan.name && (
               <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-gradient)', padding: '4px 16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>RECOMMENDED</div>
            )}
            
            <h3 style={{ marginBottom: '8px', color: plan.name === 'Premium Plan' ? 'var(--accent-purple)' : 'white' }}>{plan.name}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>₹{plan.weeklyPremium}<span style={{fontSize:'1rem', color:'var(--text-muted)', fontWeight:'normal'}}>/wk</span></div>
            <p className="text-subtle" style={{ marginBottom: '24px' }}>Max Payout: ₹{plan.maxPayout}</p>
            
            <div style={{ flex: 1, marginBottom: '24px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9rem' }}>Covered Disruptions:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {plan.coveredDisruptions.map(d => (
                   <li key={d} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                     <span style={{ color: 'var(--status-success)', marginRight: '8px' }}>✓</span> {d}
                   </li>
                ))}
              </ul>
            </div>

            <button 
              className={plan.name === 'Premium Plan' ? 'btn btn-premium' : (recommendation?.recommendedPlan === plan.name ? 'btn btn-primary' : 'btn btn-outline')}
              style={{ width: '100%' }}
              onClick={() => handleBuy(plan._id)}
            >
              Activate Policy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingPage;
