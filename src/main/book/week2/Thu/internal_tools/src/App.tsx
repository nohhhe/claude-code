import React, { useState } from 'react';
import Header from './components/Header';
import UserDisplay from './components/UserDisplay';
import { Logger } from './utils/logger';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'users'>('home');

  const handleErrorTest = () => {
    Logger.triggerTestError();
  };

  const handleWarningTest = () => {
    Logger.warn('Test warning message - This is a sample warning log');
  };

  return (
    <div className="App">
      <Header title="Hello World React App" />
      
      <nav style={{ 
        padding: '0 20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6' 
      }}>
        <button 
          onClick={() => setActiveTab('home')}
          style={{
            margin: '10px 5px',
            padding: '10px 20px',
            backgroundColor: activeTab === 'home' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            margin: '10px 5px',
            padding: '10px 20px',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          User Data
        </button>
      </nav>

      {activeTab === 'home' && (
        <main style={{ padding: '20px', textAlign: 'center' }}>
          <p>Welcome to this simple React project!</p>
          <p>This project includes a Header component and User Data functionality.</p>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Error Logging Test</h3>
            <button 
              onClick={handleErrorTest}
              style={{
                margin: '10px',
                padding: '10px 20px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Trigger Test Error
            </button>
            <button 
              onClick={handleWarningTest}
              style={{
                margin: '10px',
                padding: '10px 20px',
                backgroundColor: '#ff9944',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Trigger Test Warning
            </button>
          </div>
        </main>
      )}

      {activeTab === 'users' && <UserDisplay />}
    </div>
  );
}

export default App;