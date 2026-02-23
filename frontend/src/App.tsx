import { createSignal } from 'solid-js';
import DateDisplay from '@/components/DateDisplay';
import ApodContainer from '@/components/ApodContainer';

function App() {
  const [date, setDate] = createSignal(new Date());

  return (
    <>
      <main class="max-w-256 mx-auto p-4">
        <DateDisplay date={date} setDate={setDate} />
        <ApodContainer date={date} />
      </main>
    </>
  )
}

export default App;
