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
      <footer class="bg-white text-black p-4 mt-40">
        <h3 class="font-bold">Apsis</h3>
        <small>
          A modernized view of <a href="https://apod.nasa.gov/apod/astropix.html"> NASA's Astronomy Photo of the Day Website</a>
          <br />
          Developed by Jay Hawkins | <a href="https://github.com/jayhwkns">GitHub</a>
          <br />
          <a href="https://github.com/jayhwkns/apsis">Apsis GitHub</a>
          <br />
          The website and it's creators are in no way affiliated with NASA
          <br />
          There may be some inaccuracies in the content of this site. Notice anything usual?
          Open an issue <a href="https://github.com/jayhwkns/apsis/issues">here</a>.
        </small>
      </footer>
    </>
  )
}

export default App;
