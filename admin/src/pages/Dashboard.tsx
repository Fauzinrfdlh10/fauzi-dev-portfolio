import React, { useEffect, useState } from 'react';
import { Users, Mail, CheckCircle, Clock } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="glass" style={{ padding: '24px', flex: '1', minWidth: '200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '8px' }}>{title}</p>
        <h3 style={{ fontSize: '28px', color: 'white' }}>{value}</h3>
      </div>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    pending: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/inquiries?limit=100'); // Assuming limit 100 for stats calculation
        const inquiries = res.data.inquiries;
        
        setStats({
          total: inquiries.length,
          new: inquiries.filter((i: any) => i.status === 'new').length,
          pending: inquiries.filter((i: any) => i.status === 'pending').length,
          completed: inquiries.filter((i: any) => i.status === 'completed' || i.status === 'contacted').length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ color: 'white' }}>Loading Dashboard...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: 'white' }}>Overview Overview</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <StatCard title="Total Inquiries" value={stats.total} icon={<Users size={24} />} color="#3b82f6" />
        <StatCard title="New Messages" value={stats.new} icon={<Mail size={24} />} color="#ef4444" />
        <StatCard title="Pending Review" value={stats.pending} icon={<Clock size={24} />} color="#f59e0b" />
        <StatCard title="Contacted / Completed" value={stats.completed} icon={<CheckCircle size={24} />} color="#10b981" />
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: 'white' }}>Quick Actions</h3>
        <p className="text-muted" style={{ marginBottom: '20px' }}>Welcome to your portfolio admin dashboard. Manage your incoming messages and project inquiries here.</p>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn btn-primary" onClick={() => window.location.href = '/inquiries'}>
            View All Inquiries
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/settings'}>
            Go to Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
