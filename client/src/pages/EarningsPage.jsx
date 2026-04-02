
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiCreditCard, FiTrendingUp, FiBriefcase } from 'react-icons/fi';

const EarningsPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
         <FiCreditCard size={32} color="var(--status-success)" />
         <h1 className="text-gradient" style={{ margin: 0 }}>Earnings & Pay Till Date</h1>
      </div>

      <div className="grid-auto" style={{ marginBottom: '40px' }}>
        {/* Wallet Balance Card */}
        <div className="glass-panel" style={{ background: 'var(--premium-gradient)', color: 'white', position: 'relative', overflow: 'hidden' }}>
           <h3 style={{ marginBottom: '16px', opacity: 0.9 }}>Current Wallet Balance</h3>
           <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0' }}>₹{user.walletBalance}</p>
           <p style={{ marginTop: '16px', opacity: 0.8, fontSize: '0.9rem' }}>Ready to withdraw instantly</p>
           <FiCreditCard size={150} color="white" style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.1 }} />
        </div>

        {/* Lifetime Earnings Card */}
        <div className="glass-panel">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '8px' }}>
                 <FiTrendingUp size={24} color="var(--status-success)" />
              </div>
              <h3 className="text-subtle" style={{ margin: 0 }}>Pay Till Date (Lifetime)</h3>
           </div>
           <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--status-success)', margin: '0' }}>₹{(user.lifetimeEarnings || 0).toLocaleString('en-IN')}</p>
           <p className="text-subtle" style={{ marginTop: '16px' }}>Total protected income earned on this platform.</p>
        </div>

        {/* Average Weekly Earnings Card */}
        <div className="glass-panel">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: 'rgba(0, 210, 255, 0.1)', borderRadius: '8px' }}>
                 <FiBriefcase size={24} color="var(--accent-blue)" />
              </div>
              <h3 className="text-subtle" style={{ margin: 0 }}>Average Weekly</h3>
           </div>
           <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0' }}>₹{(user.avgWeeklyEarnings || 0).toLocaleString('en-IN')}</p>
           <p className="text-subtle" style={{ marginTop: '16px' }}>Used to calculate your max coverage needs.</p>
        </div>
      </div>
      
      {/* Visual Chart Placeholder */}
      <div className="glass-panel" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed var(--border-color)' }}>
         <p className="text-subtle" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Earnings Trend Visualization</p>
         <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '150px' }}>
            <div style={{ width: '30px', height: '60%', background: 'var(--accent-blue)', borderRadius: '4px' }}></div>
            <div style={{ width: '30px', height: '80%', background: 'var(--accent-blue)', borderRadius: '4px' }}></div>
            <div style={{ width: '30px', height: '40%', background: 'var(--accent-blue)', borderRadius: '4px' }}></div>
            <div style={{ width: '30px', height: '90%', background: 'var(--status-success)', borderRadius: '4px' }}></div>
         </div>
      </div>

    </div>
  );
};

export default EarningsPage;
