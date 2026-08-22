import { useEffect } from 'react';
import { testConnection } from './api/health.api';

function App() {
  useEffect(() => {
    testConnection()
      .then((data) => console.log('✅ Connected:', data))
      .catch((err) => console.error('❌ Connection failed:', err));
  }, []);

  return <h1>HRMS Frontend Setup</h1>;
}

export default App;