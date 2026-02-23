import { createSignal } from 'solid-js';
import DateDisplay from '@/components/DateDisplay';
import ApodContainer from '@/components/ApodContainer';
import './App.css';

function App() {
  const [date, setDate] = createSignal(new Date());

  return (
    <>
      <DateDisplay date={date} setDate={setDate} />
      <ApodContainer date={date} />
    </>
  )
}

export default App;
