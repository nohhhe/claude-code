import React, { useState } from 'react';
import { User, getUserData, getUserById } from '../services/userService';
import { Logger } from '../utils/logger';

const UserDisplay: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getUserData() as User[];
      setUsers(userData);
      Logger.info(`Successfully loaded ${userData.length} users`);
    } catch (err) {
      const errorMsg = 'Failed to load users data';
      setError(errorMsg);
      Logger.error(`${errorMsg}: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const user = await getUserById(id);
      setSelectedUser(user);
      Logger.info(`Successfully loaded user: ${user.name}`);
    } catch (err) {
      const errorMsg = `Failed to load user with ID ${id}`;
      setError(errorMsg);
      Logger.error(`${errorMsg}: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>User Data Management</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleGetAllUsers}
          disabled={loading}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Get All Users'}
        </button>
        
        {[1, 2, 3, 4].map(id => (
          <button 
            key={id}
            onClick={() => handleGetUserById(id)}
            disabled={loading}
            style={{
              margin: '5px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Get User {id}
          </button>
        ))}
        
        <button 
          onClick={() => handleGetUserById(999)}
          disabled={loading}
          style={{
            margin: '5px',
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Get Invalid User (Test Error)
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {selectedUser && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>Selected User Details</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Phone:</strong> {selectedUser.phone}</p>
          <p><strong>Department:</strong> {selectedUser.department}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
          <p><strong>Status:</strong> 
            <span style={{ 
              color: selectedUser.status === 'active' ? 'green' : 'orange',
              fontWeight: 'bold' 
            }}>
              {selectedUser.status}
            </span>
          </p>
        </div>
      )}

      {users.length > 0 && (
        <div>
          <h3>All Users ({users.length})</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {users.map(user => (
              <div 
                key={user.id}
                style={{
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '5px'
                }}
              >
                <strong>{user.name}</strong> ({user.department}) - 
                <span style={{ 
                  color: user.status === 'active' ? 'green' : 'orange',
                  marginLeft: '5px'
                }}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDisplay;