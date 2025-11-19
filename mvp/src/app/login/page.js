'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e) => {
  e.preventDefault();
  setMessage('');
  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('✅ Login successful! Redirecting...');

      setTimeout(() => {
        // Redirect to previous page if exists, else to homepage
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      }, 1000);
    } else {
      setMessage('❌ ' + data.message);
    }
  } catch (err) {
    setMessage('❌ Cannot connect to backend.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f4f8',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#1e40af',
          marginBottom: '30px',
          fontSize: '28px',
        }}>Login</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#334155',
              fontWeight: '500',
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: 'white',
                color: '#1e293b',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#334155',
              fontWeight: '500',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.3s',
                backgroundColor: 'white',
                color: '#1e293b',
              }}
            />
          </div>

          {message && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
              border: '1px solid ' + (message.includes('✅') ? '#86efac' : '#fca5a5'),
              borderRadius: '8px',
              color: message.includes('✅') ? '#166534' : '#991b1b',
              fontWeight: '500',
            }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: loading ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
