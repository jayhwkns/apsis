import { useState } from 'react';
import './App.css';
import ApodContainer from '@/components/ApodContainer';
import DateDisplay from '@/components/DateDisplay';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="App">
      <header className="App-header">
        <DateDisplay date={date} setDate={setDate} />
        <ApodContainer date={date} />
      </header>
    </div>
  );
}

export default App;
