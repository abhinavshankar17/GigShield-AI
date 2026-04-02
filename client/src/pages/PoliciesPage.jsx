import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';
import PolicyStoreWidget from '../components/PolicyStoreWidget';

const PoliciesPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      {/* Disclaimer Banner */}
      <div style={{ background: 'rgba(255, 145, 0, 0.1)', border: '1px solid var(--status-warning)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
         <FiAlertTriangle size={24} color="var(--status-warning)" />
         <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>
           <strong>Important Disclaimer:</strong> To prevent fraud, any selected parametric policy is firmly locked and <strong>cannot be dropped or changed for 7 days</strong> after subscription. You may subscribe to as many policies as needed.
         </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
         <FiShield size={32} color="var(--accent-purple)" />
         <h1 className="text-gradient" style={{ margin: 0 }}>Coverage & Policies</h1>
      </div>
      
      <p className="text-subtle" style={{ fontSize: '1.1rem', marginBottom: '40px', maxWidth: '600px' }}>
        Review your current insurance coverage and explore other parametric policies to protect your gig earnings.
      </p>

      {/* Current Active Policies List */}
      <h3 className="text-subtle" style={{ marginBottom: '16px' }}>Currently Active ({user.activePolicies?.length || 0})</h3>
      
      {user.activePolicies && user.activePolicies.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
          {user.activePolicies.map((policy) => (
            <div key={policy.id} className="glass-panel" style={{ background: 'var(--bg-panel-solid)', border: '1px solid var(--accent-blue)', padding: '16px 24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FiShield size={24} color="var(--accent-blue)" />
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{policy.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div className="badge badge-info">Active</div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ marginBottom: '40px', textAlign: 'center', opacity: 0.6 }}>
          <p>No active policies. Please select from the store below.</p>
        </div>
      )}
      
      <PolicyStoreWidget />

    </div>
  );
};

export default PoliciesPage;
