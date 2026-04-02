import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import SimulationPanel from '../components/SimulationPanel';
import { FiPieChart, FiCreditCard, FiUsers, FiAlertTriangle, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/admin/metrics', config);
      setMetrics(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMetrics();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || user.role !== 'admin' || loading) return <div className="container" style={{paddingTop: '60px'}}>Loading Admin...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 className="text-gradient">Admin Dashboard</h1>
        <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <FiLogOut /> Logout
        </button>
      </div>

      <div className="grid-auto" style={{ marginBottom: '24px' }}>
        {/* Core Stats */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiUsers size={32} color="var(--accent-blue)" />
           </div>
           <div>
             <h4 className="text-subtle">Active Coverage</h4>
             <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{metrics.totalPolicies}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(122, 40, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiCreditCard size={32} color="var(--accent-purple)" />
           </div>
           <div>
             <h4 className="text-subtle">Total Payouts</h4>
             <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{metrics.financialViability.totalPayoutsIssued}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(255, 23, 68, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiPieChart size={32} color="var(--status-error)" />
           </div>
           <div>
             <h4 className="text-subtle">Loss Ratio</h4>
             <p style={{ fontSize: '2rem', fontWeight: 'bold', color: metrics.financialViability.lossRatio > 80 ? 'var(--status-error)' : 'white' }}>
                {metrics.financialViability.lossRatio}%
             </p>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
         <SimulationPanel token={user.token} fetchMetrics={fetchMetrics} />
         
         {/* Financial / Fraud Panel */}
         <div className="glass-panel">
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAlertTriangle color="var(--status-warning)"/> Fraud Alerts & Claim Status
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
               <div>
                  <h4 className="text-subtle">Claims Auto-Paid</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-success)' }}>{metrics.payoutStats.autoPaidCount}</p>
               </div>
               <div>
                  <h4 className="text-subtle">Under Review</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-warning)' }}>{metrics.payoutStats.underReviewCount}</p>
               </div>
               <div>
                  <h4 className="text-subtle">Fraud Flags</h4>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-error)' }}>{metrics.payoutStats.highRiskFlags}</p>
               </div>
            </div>

            <h4 style={{ marginBottom: '16px' }}>Recent Fraud Triggers</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
               {metrics.recentFraudAlerts.length === 0 ? (
                  <p className="text-subtle">No fraud detected yet.</p>
               ) : (
                  metrics.recentFraudAlerts.map(alert => (
                     <div key={alert._id} style={{ background: 'var(--bg-panel-solid)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--status-error)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                           <strong>{alert.user?.name}</strong>
                           <span className="badge badge-error">Score: {alert.fraudScoreSnapshot}</span>
                        </div>
                        <p className="text-subtle" style={{ margin: 0, fontSize: '0.9rem' }}>Zone Mismatch or Pattern Anomaly Detected</p>
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
