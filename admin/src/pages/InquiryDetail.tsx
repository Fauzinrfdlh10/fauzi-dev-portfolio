import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Send, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const res = await api.get(`/inquiries/${id}`);
        setInquiry(res.data);
        setStatus(res.data.status);
      } catch (error) {
        toast.error('Failed to load inquiry');
        navigate('/inquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiry();
  }, [id, navigate]);

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      toast.success('Status updated successfully');
      setInquiry({ ...inquiry, status });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return toast.error('Reply message is required');
    setSendingReply(true);
    try {
      const res = await api.post(`/inquiries/${id}/reply`, { replyMessage });
      toast.success(res.data.message || 'Reply sent successfully');
      setReplyMessage('');
      setStatus('contacted');
      setInquiry({ ...inquiry, status: 'contacted' });
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) return <div style={{ color: 'white' }}>Loading...</div>;
  if (!inquiry) return null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/inquiries')} style={{ padding: '8px' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ color: 'white' }}>Inquiry Details</h2>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Left Column: Inquiry Info */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: 'white', marginBottom: '4px' }}>{inquiry.subject}</h3>
                <p className="text-muted" style={{ fontSize: '14px' }}>From: <span style={{ color: 'white' }}>{inquiry.full_name}</span> ({inquiry.email})</p>
              </div>
              <div className="text-muted" style={{ fontSize: '12px' }}>
                {format(new Date(inquiry.created_at), 'MMMM dd, yyyy h:mm a')}
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {inquiry.message}
            </div>
          </div>

          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>Reply via Email</h3>
            <textarea 
              className="form-control" 
              style={{ width: '100%', minHeight: '150px', marginBottom: '16px', resize: 'vertical' }}
              placeholder={`Write a reply to ${inquiry.full_name}...`}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-primary" 
                onClick={handleSendReply}
                disabled={sendingReply}
              >
                <Send size={16} />
                {sendingReply ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>Manage Inquiry</h3>
            
            <div className="form-group mb-4">
              <label className="form-label">Current Status</label>
              <select 
                className="form-control" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ appearance: 'auto', background: 'rgba(0,0,0,0.4)' }}
              >
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button 
              className="btn btn-secondary" 
              style={{ width: '100%' }}
              onClick={handleUpdateStatus}
              disabled={status === inquiry.status}
            >
              <Save size={16} />
              Save Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
