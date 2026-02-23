import { createSignal } from 'solid-js';
import DateDisplay from '@/components/DateDisplay';
import ApodContainer from '@/components/ApodContainer';

function App() {
  const [date, setDate] = createSignal(new Date());

  return (
    <>
      <div class="max-w-128 mx-auto">
        <DateDisplay date={date} setDate={setDate} />
        <ApodContainer date={date} />
      </div>
    </>
  )
}

export default App;
