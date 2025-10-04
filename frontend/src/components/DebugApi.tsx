import React, { useState } from 'react';

const DebugApi: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          full_name: 'Test User',
          password: 'testpass123'
        })
      });
      
      const data = await response.json();
      setResult(`Register Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Register Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', 'test@example.com');
      formData.append('password', 'testpass123');
      
      const response = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setResult(`Login Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResult(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Debug</h3>
      <button onClick={testRegister} disabled={loading}>
        Test Register
      </button>
      <button onClick={testLogin} disabled={loading} style={{ marginLeft: '10px' }}>
        Test Login
      </button>
      {loading && <p>Loading...</p>}
      {result && (
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          marginTop: '10px',
          whiteSpace: 'pre-wrap',
          fontSize: '12px'
        }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default DebugApi;