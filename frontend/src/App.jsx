import { useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        setError('Không lấy được dữ liệu');
      }
    } catch (err) {
      setError('Lỗi kết nối đến Backend Python API!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Demo CI/CD: ReactJS + Python FastAPI + MySQL</h1>
      <button 
        onClick={fetchUsers} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? 'Đang tải...' : 'Lấy danh sách Users từ API'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '20px' }}>
        {users.map((u) => (
          <li key={u.id}>
            <strong>{u.name}</strong> - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;