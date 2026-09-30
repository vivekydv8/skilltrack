import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const DigiLockerCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const traineeId = localStorage.getItem('skilltrack_trainee_id');

    if (error) {
      setStatus('error');
      setMessage('DigiLocker authorization was denied or cancelled.');
      setDetail(`DigiLocker returned: ${error} — ${searchParams.get('error_description') || ''}`);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setMessage('Invalid callback — missing authorization code.');
      setDetail('Expected ?code= and ?state= query parameters from DigiLocker.');
      return;
    }

    if (!traineeId) {
      setStatus('error');
      setMessage('Session not found. Please log in again.');
      setDetail('Could not find trainee_id in browser session.');
      return;
    }

    // Exchange code for token
    fetch('/api/digilocker/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state, trainee_id: traineeId }),
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({ detail: res.statusText }));
          throw new Error(err.detail || 'Token exchange failed');
        }
        return res.json();
      })
      .then(data => {
        setStatus('success');
        setMessage('DigiLocker connected successfully!');
        setDetail(`Your DigiLocker account${data.digilocker_user_id ? ` (${data.digilocker_user_id})` : ''} is now linked to your SkillTrackAI profile.`);
        setTimeout(() => navigate('/trainee/dashboard'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage('Connection failed.');
        setDetail(err.message || 'An unexpected error occurred.');
      });
  }, [searchParams, navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f9fc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        {/* DigiLocker Brand */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff3e0', border: '1px solid #FF6600', borderRadius: '6px', padding: '8px 16px', marginBottom: '16px' }}>
            <span style={{ fontSize: '18px' }}>🔒</span>
            <span style={{ fontWeight: 700, color: '#FF6600', fontSize: '16px' }}>DigiLocker</span>
          </div>
        </div>

        {status === 'loading' && (
          <>
            <Loader className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1a202c', marginBottom: '8px' }}>Connecting to DigiLocker...</h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>Exchanging authorization token. Please wait.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>{message}</h2>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px' }}>{detail}</p>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '12px', fontSize: '13px', color: '#166534' }}>
              Redirecting to your dashboard in 3 seconds...
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#991b1b', marginBottom: '8px' }}>{message}</h2>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px' }}>{detail}</p>
            <button
              onClick={() => navigate('/trainee/dashboard')}
              style={{ padding: '10px 20px', background: '#1a56db', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Return to Dashboard
            </button>
          </>
        )}

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', fontSize: '11px', color: '#9ca3af' }}>
          SkillTrackAI · Government of Maharashtra · DSEI<br />
          DigiLocker is a service of Ministry of Electronics &amp; IT, Govt. of India
        </div>
      </div>
    </div>
  );
};
