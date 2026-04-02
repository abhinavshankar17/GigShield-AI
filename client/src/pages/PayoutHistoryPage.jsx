import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

const PayoutHistoryPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
         <FiClock size={32} color="var(--accent-blue)" />
         <h1 className="text-gradient" style={{ margin: 0 }}>Payout & Claims History</h1>
      </div>
      
      <p className="text-subtle" style={{ fontSize: '1.1rem', marginBottom: '40px', maxWidth: '600px' }}>
        Review all parametric micro-insurance payouts triggered automatically by the GigShield AI engine based on real-world conditions.
      </p>

      {(!user.payoutHistory || user.payoutHistory.length === 0) ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p className="text-subtle" style={{ fontSize: '1.2rem' }}>No recent payouts right now. You are safe!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {user.payoutHistory.map((payout) => (
            <div key={payout.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '16px', borderRadius: '50%' }}>
                   <FiCheckCircle size={32} color="var(--status-success)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{payout.trigger}</h4>
                  <p className="text-subtle">{payout.date} • AI Auto-Triggered via Sensors</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'var(--status-success)', margin: 0 }}>+₹{payout.amount}</p>
                <div className="badge badge-success" style={{ marginTop: '8px' }}>{payout.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayoutHistoryPage;
