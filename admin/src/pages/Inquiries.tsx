import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      setInquiries(res.data.inquiries);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await api.delete(`/inquiries/${id}`);
        setInquiries(inquiries.filter((inq) => inq.id !== id));
        toast.success('Inquiry deleted');
      } catch (error) {
        toast.error('Failed to delete inquiry');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <span className="badge badge-new">New</span>;
      case 'pending': return <span className="badge badge-pending">Pending</span>;
      case 'contacted': return <span className="badge badge-contacted">Contacted</span>;
      case 'completed': return <span className="badge badge-completed">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'white' }}>Project Inquiries</h2>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted" style={{ padding: '20px' }}>No inquiries found</td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id}>
                  <td className="text-muted">{format(new Date(inq.created_at), 'MMM dd, yyyy')}</td>
                  <td style={{ color: 'white', fontWeight: 500 }}>{inq.full_name}</td>
                  <td className="text-muted">{inq.email}</td>
                  <td style={{ color: 'white' }}>{inq.subject}</td>
                  <td>{getStatusBadge(inq.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 10px' }}
                        onClick={() => navigate(`/inquiries/${inq.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 10px' }}
                        onClick={() => handleDelete(inq.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inquiries;
