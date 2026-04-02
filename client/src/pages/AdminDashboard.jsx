import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiUsers, FiCreditCard, FiAlertTriangle, FiLogOut, FiShield, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const mockRiderDatabase = [
  { id: 'R001', name: 'Ritesh Kumar', zone: 'Chennai (T. Nagar)', activePolicies: 2, income: 145000, payouts: 950, fraudScore: 12, fraudReason: null },
  { id: 'R002', name: 'Priya Sharma', zone: 'Mumbai (Andheri West)', activePolicies: 1, income: 82000, payouts: 0, fraudScore: 5, fraudReason: null },
  { id: 'R003', name: 'Rahul Singh', zone: 'Bangalore (Koramangala)', activePolicies: 4, income: 110000, payouts: 8500, fraudScore: 92, fraudReason: 'Excessive Claims & Location Mismatch' },
  { id: 'R004', name: 'Anita Desai', zone: 'Delhi (Connaught Place)', activePolicies: 0, income: 45000, payouts: 0, fraudScore: 1, fraudReason: null },
  { id: 'R005', name: 'Vikram Reddy', zone: 'Hyderabad (Banjara Hills)', activePolicies: 3, income: 210000, payouts: 1200, fraudScore: 45, fraudReason: 'Suspicious Activity Detected' }
];

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Aggregated Stats
  const totalRiders = mockRiderDatabase.length + 1445; // Simulated base
  const totalPolicies = mockRiderDatabase.reduce((acc, r) => acc + r.activePolicies, 810);
  const totalPayouts = mockRiderDatabase.reduce((acc, r) => acc + r.payouts, 44050);

  // Note: For demo purposes, we're not rigidly blocking render if role !== admin right here, 
  // relying on App.jsx ProtectedRoute instead, but keeping a fallback just in case.
  if (!user) return <div className="container" style={{paddingTop: '60px'}}>Loading Admin...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '40px', background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-main)' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <h1 className="text-gradient" style={{ margin: 0 }}>Fleet Management Hub</h1>
           <p className="text-subtle" style={{ margin: '8px 0 0 0' }}>GigShield AI Central Command</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <FiLogOut /> Admin Logout
        </button>
      </div>

      {/* Global Aggregation Stats */}
      <div className="grid-auto" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiUsers size={32} color="var(--accent-blue)" />
           </div>
           <div>
             <h4 className="text-subtle">Total Registered Riders</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{totalRiders.toLocaleString('en-IN')}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiShield size={32} color="var(--status-success)" />
           </div>
           <div>
             <h4 className="text-subtle">Active Parametric Coverages</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>{totalPolicies.toLocaleString('en-IN')}</p>
           </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ background: 'rgba(122, 40, 255, 0.1)', padding: '16px', borderRadius: '12px' }}>
             <FiCreditCard size={32} color="var(--accent-purple)" />
           </div>
           <div>
             <h4 className="text-subtle">Total Payouts Triggered</h4>
             <p style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0 }}>₹{totalPayouts.toLocaleString('en-IN')}</p>
           </div>
        </div>
      </div>

      {/* Rider Fleet Tracking Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
             <FiActivity color="var(--accent-blue)" /> Individual Rider Analytics & Fraud Tracking
           </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Rider ID & Name</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Operating Zone</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Policies</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Lifetime Income</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Total Claims Paid</th>
                <th style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>Fraud Score & Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRiderDatabase.map((rider) => (
                <tr key={rider.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' }}}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 'bold' }}>{rider.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rider.id}</div>
                  </td>
                  <td style={{ padding: '20px 24px', color: 'var(--text-main)' }}>{rider.zone}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <span className="badge badge-info">{rider.activePolicies} Active</span>
                  </td>
                  <td style={{ padding: '20px 24px', fontWeight: 'bold' }}>₹{rider.income.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '20px 24px', fontWeight: 'bold', color: 'var(--status-success)' }}>₹{rider.payouts.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                          background: rider.fraudScore > 80 ? 'rgba(255, 23, 68, 0.1)' : rider.fraudScore > 40 ? 'rgba(255, 145, 0, 0.1)' : 'rgba(0, 230, 118, 0.1)',
                          color: rider.fraudScore > 80 ? 'var(--status-error)' : rider.fraudScore > 40 ? 'var(--status-warning)' : 'var(--status-success)',
                          border: `2px solid ${rider.fraudScore > 80 ? 'var(--status-error)' : rider.fraudScore > 40 ? 'var(--status-warning)' : 'var(--status-success)'}`
                       }}>
                         {rider.fraudScore}
                       </div>
                       {rider.fraudReason && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: '0.8rem', color: 'var(--status-error)' }}><FiAlertTriangle /> Suspicious</span>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rider.fraudReason}</span>
                          </div>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
