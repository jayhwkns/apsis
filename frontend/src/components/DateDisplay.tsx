import { BiRegularLeftArrow, BiSolidLeftArrow } from "solid-icons/bi";
import { createSignal, type Accessor, type Setter } from "solid-js";

export default function DateDisplay(
  { date, setDate }: { date: Accessor<Date>, setDate: Setter<Date> }
) {
  const monthName = () => date().toLocaleDateString("default", { month: "long" });
  const day = () => ordinalSuffix(date().getDate());
  return (
    <div class="w-3/5 mx-auto text-center text-3xl bg-zinc-900 border-1 border-zinc-800 my-4">
      <span class="flex justify-evenly p-4 w-full h-full">
        <PrevNextButton date={date} setDate={setDate} offset={-1} />
        {`${date().getFullYear()} ${monthName()} ${day()}`}
        <PrevNextButton date={date} setDate={setDate} offset={1} />
      </span>
      {isToday(date()) && (
        <div class="text-sm">(Today)</div>
      )}
    </div>
  )
}

function PrevNextButton({ date, setDate, offset }: { date: Accessor<Date>, setDate: Setter<Date>, offset: number }
) {
  const disable = () => isToday(date()) && offset > 0;
  const [hovered, setHovered] = createSignal(false);
  const arrowClass = () => `${offset > 0 && "rotate-180"}`

  return (
    <button
      disabled={disable()}
      class="hover:cursor-pointer"
      /*
        setDate() in the Date class takes care of overflow and underflow with
        the months, while setDate() takes care of the SolidJS state.
        Date constructor is needed because date.setDate returns a number
      */
      onClick={() => setDate(new Date(date().setDate(date().getDate() + offset)))}
      on:mouseleave={() => setHovered(false)}
      on:mouseover={() => setHovered(true)}
    >
      {hovered() ?
        <BiSolidLeftArrow class={arrowClass()} />
        :
        <BiRegularLeftArrow class={arrowClass()} />
      }
    </button>
  )
}

function isToday(date: Date) {
  const today = new Date();
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

function ordinalSuffix(n: number): string {
  if (n > 3 && n < 21) return n + "th";
  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}
