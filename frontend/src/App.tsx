import React from 'react';
import './App.css';
import FlagInfo from '@/components/FlagInfo';
import UserInfo from '@/components/UserInfo';
import ApodContainer from '@/components/ApodContainer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserInfo />
        <FlagInfo />
        <ApodContainer />
      </header>
    </div>
  );
}

export default App;
