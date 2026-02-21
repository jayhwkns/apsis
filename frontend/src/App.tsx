import React from 'react';
import './App.css';
import FlagInfo from '@/components/FlagInfo';
import UserInfo from '@/components/UserInfo';
import ApodDisplay from '@/components/ApodDisplay';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserInfo />
        <FlagInfo />
        <ApodDisplay />
      </header>
    </div>
  );
}

export default App;
