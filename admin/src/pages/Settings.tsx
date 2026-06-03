import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail } from 'lucide-react';

const Settings = () => {
  const { admin } = useContext(AuthContext);

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '24px' }}>Settings</h2>
      
      <div className="glass" style={{ padding: '30px', maxWidth: '600px' }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Profile Information</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', color: 'white', fontWeight: 'bold'
          }}>
            {admin?.name.charAt(0) || 'A'}
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '20px', marginBottom: '4px' }}>{admin?.name}</h4>
            <p className="text-muted">Administrator</p>
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Full Name</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-muted)' }}>
              <User size={18} />
            </div>
            <input type="text" className="form-control" style={{ paddingLeft: '40px', width: '100%' }} value={admin?.name || ''} readOnly />
          </div>
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Email Address</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-muted)' }}>
              <Mail size={18} />
            </div>
            <input type="email" className="form-control" style={{ paddingLeft: '40px', width: '100%' }} value={admin?.email || ''} readOnly />
          </div>
        </div>
        
        <p className="text-muted" style={{ fontSize: '14px', marginTop: '20px' }}>
          Note: Updating profile details requires direct database access in this version.
        </p>
      </div>
    </div>
  );
};

export default Settings;
