import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Simple React App" }) => {
  return (
    <header style={{
      backgroundColor: '#282c34',
      padding: '20px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;