import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiShield, FiSun, FiCloudRain, FiAlertOctagon, FiWind, FiAlertTriangle, FiDroplet } from 'react-icons/fi';

const availablePolicies = [
  {
    id: "pol_1",
    name: "Heavy Rain Protection",
    description: "Auto-payout if rainfall exceeds 20mm/hr in your active zone.",
    weeklyPremium: 50,
    maxPayout: 1500,
    icon: FiCloudRain,
    color: "var(--accent-blue)"
  },
  {
    id: "pol_2",
    name: "Heatwave Shield",
    description: "Auto-payout if temperature exceeds 40°C during peak hours.",
    weeklyPremium: 40,
    maxPayout: 1200,
    icon: FiSun,
    color: "var(--status-warning)"
  },
  {
    id: "pol_3",
    name: "Traffic Gridlock Cover",
    description: "Compensation for severe unpredicted traffic delays (AI verified).",
    weeklyPremium: 70,
    maxPayout: 2000,
    icon: FiAlertOctagon,
    color: "var(--status-error)"
  },
  {
    id: "pol_4",
    name: "Cyclone & High Wind Cover",
    description: "Protection against severe cyclones and wind speeds > 60km/h (Coastal zones).",
    weeklyPremium: 60,
    maxPayout: 1800,
    icon: FiWind,
    color: "var(--accent-purple)"
  },
  {
    id: "pol_5",
    name: "Landslide Protection",
    description: "Immediate payout for work disrupted by verified landslides in hilly regions.",
    weeklyPremium: 80,
    maxPayout: 2500,
    icon: FiAlertTriangle,
    color: "#ff9100"
  },
  {
    id: "pol_6",
    name: "Urban Flood Shield",
    description: "Triggered instantly when waterlogging reaches critical levels during monsoons.",
    weeklyPremium: 90,
    maxPayout: 3000,
    icon: FiDroplet,
    color: "#00b0ff"
  }
];

const PolicyStoreWidget = () => {
  const { user, subscribePolicy, unsubscribePolicy } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [lockAlert, setLockAlert] = useState({ show: false, message: '' });

  if (!user) return null;

  const handleSubscribe = (policy) => {
    subscribePolicy(policy);
  };

  const handleDrop = (policyId) => {
    const result = unsubscribePolicy(policyId);
    if (!result.success) {
      setLockAlert({ show: true, message: result.message });
    }
  };

  if (!isOpen) {
    return (
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-premium" onClick={() => setIsOpen(true)}>
          Explore Coverage Store
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '24px', border: '1px solid var(--accent-purple)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <h3 className="text-premium">Explore Policies</h3>
         <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setIsOpen(false)}>Close</button>
      </div>

      <div className="grid-auto">
        {availablePolicies.map((policy) => {
          const Icon = policy.icon;
          const isActive = user.activePolicies && user.activePolicies.find(p => p.id === policy.id);

          return (
            <div key={policy.id} style={{ 
              background: 'var(--bg-input)', 
              borderRadius: '12px', 
              padding: '20px',
              border: isActive ? `2px solid ${policy.color}` : '2px solid transparent',
              transition: 'all 0.3s ease'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                 <div style={{ padding: '10px', background: 'var(--bg-panel-solid)', borderRadius: '8px' }}>
                   <Icon size={24} color={policy.color} />
                 </div>
                 <h4 style={{ margin: 0 }}>{policy.name}</h4>
               </div>
               <p className="text-subtle" style={{ minHeight: '40px', marginBottom: '16px' }}>{policy.description}</p>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                 <div>
                   <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Premium</p>
                   <p style={{ fontWeight: 'bold' }}>₹{policy.weeklyPremium}/wk</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Max Payout</p>
                   <p style={{ fontWeight: 'bold', color: 'var(--status-success)' }}>₹{policy.maxPayout}</p>
                 </div>
               </div>

               {isActive ? (
                 <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--status-error)', color: 'var(--status-error)' }} onClick={() => handleDrop(policy.id)}>Drop Policy</button>
               ) : (
                 <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleSubscribe(policy)}>Subscribe</button>
               )}
            </div>
          );
        })}
      </div>

      {/* Custom Lockout Alert Modal */}
      {lockAlert.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', border: '1px solid var(--status-error)', textAlign: 'center', padding: '30px' }}>
              <FiAlertTriangle size={48} color="var(--status-error)" style={{ marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '12px', color: 'var(--status-error)' }}>Action Blocked</h3>
              <p style={{ marginBottom: '24px', lineHeight: 1.5 }}>{lockAlert.message}</p>
              <button className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--text-muted)', color: 'var(--text-main)' }} onClick={() => setLockAlert({ show: false, message: '' })}>Understood</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default PolicyStoreWidget;
