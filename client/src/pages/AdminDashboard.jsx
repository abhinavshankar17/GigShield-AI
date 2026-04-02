import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  FiUsers, FiCreditCard, FiAlertTriangle, FiLogOut, FiShield, 
  FiActivity, FiMapPin, FiPlayCircle, FiTrendingUp, FiCheckCircle, 
  FiXCircle, FiSettings, FiBarChart2, FiCpu 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [riders, setRiders] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [zones, setZones] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [selectedRider, setSelectedRider] = useState(null);
  const [auditRider, setAuditRider] = useState(null);

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchData = async () => {
    try {
      const [mRes, rRes, pRes, zRes, hRes] = await Promise.all([
        axios.get('/api/admin/metrics', config),
        axios.get('/api/admin/riders', config),
        axios.get('/api/admin/payouts', config),
        axios.get('/api/admin/zones', config),
        axios.get('/api/admin/system-health', config)
      ]);
      setMetrics(mRes.data);
      setRiders(rRes.data);
      setPayouts(pRes.data);
      setZones(zRes.data);
      setSystemHealth(hRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Admin data fetch error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdatePayout = async (id, status) => {
    try {
      await axios.put(`/api/admin/payouts/${id}/status`, { status }, config);
      fetchData();
    } catch (err) { alert("Failed to update payout"); }
  };

  const handleUpdateMultiplier = async (id, multiplier) => {
    try {
      await axios.put(`/api/admin/zones/${id}/multiplier`, { multiplier }, config);
      fetchData();
    } catch (err) { alert("Failed to update multiplier"); }
  };

  const handleSuspendRider = async (id, isSuspended) => {
    try {
      await axios.put(`/api/admin/riders/${id}/suspend`, { isSuspended }, config);
      setAuditRider(null);
      fetchData();
    } catch (err) { alert("Failed to update suspension status"); }
  };

  if (loading) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Loading Command Center...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '280px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--border-light)', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px', padding: '0 10px' }}>
           <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>GigShield AI</h2>
           <p className="text-subtle" style={{ fontSize: '0.8rem' }}>Admin Control Panel</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', icon: <FiBarChart2 />, label: 'Dashboard Overview' },
            { id: 'fleet', icon: <FiUsers />, label: 'Rider Fleet' },
            { id: 'claims', icon: <FiCreditCard />, label: 'Claims Queue' },
            { id: 'pricing', icon: <FiTrendingUp />, label: 'Pricing Engine' },
            { id: 'heatmap', icon: <FiMapPin />, label: 'Market Heatmap' },
            { id: 'health', icon: <FiCpu />, label: 'System Health' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeTab === tab.id ? 'var(--accent-gradient)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                transition: '0.3s', fontWeight: activeTab === tab.id ? '600' : 'normal'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <button className="btn btn-outline" onClick={handleLogout} style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
           <FiLogOut /> Logout
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Tab Content: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
            <div className="grid-auto" style={{ marginBottom: '40px' }}>
              <StatCard icon={<FiUsers color="var(--accent-blue)"/>} label="Total Riders" value={metrics?.totalWorkers || 0} />
              <StatCard icon={<FiShield color="var(--status-success)"/>} label="Active Policies" value={metrics?.totalPolicies || 0} />
              <StatCard icon={<FiCreditCard color="var(--accent-purple)"/>} label="Total Payouts" value={`₹${metrics?.financialViability?.totalPayoutsIssued || 0}`} />
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
               <h3>Financial Health</h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '20px' }}>
                  <div>
                    <p className="text-subtle">Loss Ratio</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: metrics?.financialViability?.lossRatio > 80 ? 'var(--status-error)' : 'var(--status-success)' }}>
                      {metrics?.financialViability?.lossRatio}%
                    </p>
                  </div>
                  <div>
                    <p className="text-subtle">Sustainability</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{metrics?.financialViability?.profitabilityStatus}</p>
                  </div>
                  <div>
                    <p className="text-subtle">Reserve Balance</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{metrics?.financialViability?.reserveBalance?.toLocaleString()}</p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Tab Content: FLEET */}
        {activeTab === 'fleet' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Rider Fleet</h1>
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Rider</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Zone</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Fraud Score</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 'bold' }}>{r.name} {r.isSuspended && <span className="badge badge-error" style={{fontSize:'0.6rem'}}>SUSPENDED</span>}</div>
                        <div className="text-subtle" style={{ fontSize: '0.8rem' }}>{r.email}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>{r.primaryZone}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.fraudScore > 70 ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: r.fraudScore > 70 ? 'var(--status-error)' : 'var(--status-success)', border: '1px solid', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {r.fraudScore}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button onClick={() => setSelectedRider(r)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FiMapPin /> Trace</button>
                          <button onClick={() => setAuditRider(r)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}><FiAlertTriangle /> Audit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: CLAIMS QUEUE */}
        {activeTab === 'claims' && (
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>Claims & Overrides</h1>
            <div className="glass-panel" style={{ padding: 0 }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Rider</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Trigger</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '16px 24px', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '16px 24px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map(p => (
                      <tr key={p._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '16px 24px' }}>{p.user?.name}</td>
                        <td style={{ padding: '16px 24px' }}>
                           <div style={{ fontWeight: 'bold' }}>{p.triggerEvent?.type}</div>
                           <div className="text-subtle" style={{ fontSize: '0.8rem' }}>{p.triggerEvent?.zone}</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>₹{p.finalPayoutAmount}</td>
                        <td style={{ padding: '16px 24px' }}>
                           <span className={`badge badge-${p.status === 'Approved' || p.status === 'Auto-Paid' ? 'success' : (p.status === 'Rejected' ? 'error' : 'info')}`}>
                              {p.status}
                           </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          {p.status === 'Pending' || p.status === 'Under Review' ? (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                               <button onClick={() => handleUpdatePayout(p._id, 'Approved')} style={{ background: 'var(--status-success)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><FiCheckCircle /></button>
                               <button onClick={() => handleUpdatePayout(p._id, 'Rejected')} style={{ background: 'var(--status-error)', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}><FiXCircle /></button>
                            </div>
                          ) : <FiCheckCircle color="gray" />}
                        </td>
                      </tr>
                    ))}
                    {payouts.length === 0 && <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', color:'var(--text-muted)'}}>No claims recorded.</td></tr>}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Tab Content: PRICING ENGINE */}
        {activeTab === 'pricing' && (
          <div className="animate-fade-in">
             <h1 style={{ marginBottom: '30px' }}>Dynamic Pricing Engine</h1>
             <p className="text-subtle" style={{ marginBottom: '20px' }}>Adjust city-wide risk multipliers to scale premiums in real-time based on live environmental threats.</p>
             <div className="grid-auto">
               {zones.map(z => (
                 <div key={z._id} className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>{z.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="text-subtle">Current Multiplier</span>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>{z.pricingMultiplier}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="3.0" step="0.1" 
                      value={z.pricingMultiplier} 
                      onChange={(e) => handleUpdateMultiplier(z._id, parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-blue)' }} 
                    />
                    <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                       Risk Indicators: Rain ({z.rainRisk}%) | Traffic ({z.trafficRisk}%)
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Tab Content: HEATMAP */}
        {activeTab === 'heatmap' && (
           <div className="animate-fade-in" style={{ height: '100%' }}>
              <h1 style={{ marginBottom: '20px' }}>Market Macro Heatmap</h1>
              <div className="glass-panel" style={{ padding: 0, height: 'calc(100% - 70px)', overflow: 'hidden' }}>
                 <iframe 
                    width="100%" height="100%" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=80.1%2C12.9%2C80.3%2C13.1&amp;layer=mapnik" 
                    style={{ border: 0 }}
                 ></iframe>
              </div>
           </div>
        )}

        {/* Tab Content: HEALTH */}
        {activeTab === 'health' && (
          <div className="animate-fade-in">
             <h1 style={{ marginBottom: '30px' }}>System Infrastructure Health</h1>
             <div className="grid-auto">
                <HealthCard label="Google Maps API" data={systemHealth?.googleMaps} />
                <HealthCard label="OpenWeather Platform" data={systemHealth?.openWeather} />
                <HealthCard label="Stripe Infrastructure" data={systemHealth?.stripe} />
                <HealthCard label="Primary Database" data={systemHealth?.database} />
             </div>
             <div className="glass-panel" style={{ marginTop: '40px', padding: '20px', textAlign: 'center' }}>
                <p className="text-subtle">System Uptime: <span style={{ color: 'var(--status-success)', fontWeight: 'bold' }}>{systemHealth?.uptime}</span></p>
             </div>
          </div>
        )}

      </div>

      {/* MODAL: Trace Location */}
      {selectedRider && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '80%', height: '80%', padding: '30px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
               <h2>Tracing: {selectedRider.name}</h2>
               <button onClick={() => setSelectedRider(null)} className="btn btn-outline">Close</button>
            </div>
            <iframe 
               width="100%" flex="1" height="100%"
               src={`https://www.openstreetmap.org/export/embed.html?bbox=80.18%2C12.98%2C80.26%2C13.06&layer=mapnik&marker=13.04%2C80.23`}
               style={{ border: 0, borderRadius: '12px' }}
            ></iframe>
          </div>
        </div>
      )}

      {/* MODAL: Deep Fraud Audit */}
      {auditRider && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
          <div className="glass-panel" style={{ width: '500px', padding: '30px' }}>
            <h2 style={{ marginBottom: '10px' }}>Fraud Investigation</h2>
            <p className="text-subtle" style={{ marginBottom: '24px' }}>In-depth AI analysis for {auditRider.name}</p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>AI Risk Assessment:</span>
                  <span style={{ color: auditRider.fraudScore > 70 ? 'var(--status-error)' : 'var(--status-success)', fontWeight: 'bold' }}>{auditRider.fraudStatus}</span>
               </div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Anomaly Log:</strong><br/>
                  - Occasional GPS jumping detected (~400m variance)<br/>
                  - Device ID matches multiple registered accounts (Flagged)<br/>
                  - Payout velocity higher than average for {auditRider.primaryZone}
               </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
               <button 
                  className={auditRider.isSuspended ? "btn btn-outline" : "btn btn-error"} 
                  style={{ flex: 1 }}
                  onClick={() => handleSuspendRider(auditRider._id, !auditRider.isSuspended)}
               >
                  {auditRider.isSuspended ? "Reactivate Account" : "Suspend Account"}
               </button>
               <button onClick={() => setAuditRider(null)} className="btn btn-outline" style={{ flex: 1 }}>Close Audit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>{icon}</div>
    <div>
      <p className="text-subtle" style={{ margin: 0, fontSize: '0.85rem' }}>{label}</p>
      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  </div>
);

const HealthCard = ({ label, data }) => (
  <div className="glass-panel" style={{ padding: '20px' }}>
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0 }}>{label}</h4>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 10px var(--status-success)' }}></div>
     </div>
     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
        <span className="text-subtle">Status</span>
        <span style={{ color: 'var(--status-success)' }}>{data?.status}</span>
     </div>
     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '6px' }}>
        <span className="text-subtle">Latency</span>
        <span>{data?.latency}</span>
     </div>
  </div>
);

export default AdminDashboard;
