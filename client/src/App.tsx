import React from 'react';
import './App.css';
import FlagInfo from './components/FlagInfo';
import UserInfo from './components/UserInfo';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <UserInfo />
        <FlagInfo />
      </header>
    </div>
  );
}

export default App;
