import React from 'react';
import { FiAlertCircle, FiCloudDrizzle, FiSun } from 'react-icons/fi';

const CommunityFeed = ({ zone }) => {
  const mockFeed = [
    { id: 1, type: 'warning', text: `Heavy rain expected in ${zone} between 4 PM - 7 PM`, icon: <FiCloudDrizzle/> },
    { id: 2, type: 'info', text: '72% of riders in your zone likely impacted today', icon: <FiAlertCircle/> },
    { id: 3, type: 'danger', text: 'Traffic disruption reported near Main Junction', icon: <FiSun/> }
  ];

  return (
    <div className="glass-panel" style={{ height: '100%' }}>
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
        <span className="live-indicator"></span> Live Community Feed
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockFeed.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', background: 'var(--bg-panel-solid)', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${item.type === 'danger' ? 'var(--status-error)' : 'var(--accent-blue)'}` }}>
            <div style={{ marginRight: '12px', color: item.type === 'danger' ? 'var(--status-error)' : 'var(--accent-blue)' }}>{item.icon}</div>
            <p className="text-subtle" style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
