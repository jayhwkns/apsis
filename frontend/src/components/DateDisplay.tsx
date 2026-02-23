import { BiRegularLeftArrow, BiSolidLeftArrow } from "solid-icons/bi";
import { createSignal, type Accessor, type Setter } from "solid-js";

export default function DateDisplay(
  { date, setDate }: { date: Accessor<Date>, setDate: Setter<Date> }
) {
  const monthName = () => date().toLocaleDateString("default", { month: "long" });
  const day = () => ordinalSuffix(date().getDate());
  return (
    <div class="relative w-1/2 mx-auto text-center text-3xl bg-linear-0 from-zinc-850 to-zinc-900 border-1 border-zinc-800 my-2">
      <span class="flex p-4 w-full h-full">
        <PrevNextButton date={date} setDate={setDate} offset={-1} />
        <div class="mx-auto">
          {`${date().getFullYear()} ${monthName()} ${day()}`}
        </div>
        <PrevNextButton date={date} setDate={setDate} offset={1} />
      </span>
      {isToday(date()) && (
        <div
          class="absolute bottom-0 left-[50%] translate-x-[-50%] text-sm text-zinc-500"
        >
          (Today)
        </div>
      )}
    </div>
  )
}

function PrevNextButton({ date, setDate, offset }: { date: Accessor<Date>, setDate: Setter<Date>, offset: number }
) {
  const disable = () => isToday(date()) && offset > 0;
  const [hovered, setHovered] = createSignal(false);
  const arrowClass = () => `${offset > 0 ?
    `rotate-180 mr-2 ${disable() && "text-zinc-800"}`
    :
    "ml-2"
    }`

  return (
    <button
      disabled={disable()}
      class={disable() ? "" : "hover:cursor-pointer"}
      /*
        setDate() in the Date class takes care of overflow and underflow with
        the months, while setDate() takes care of the SolidJS state.
        Date constructor is needed because date.setDate returns a number
      */
      onClick={() => setDate(new Date(date().setDate(date().getDate() + offset)))}
      on:mouseleave={() => setHovered(false)}
      on:mouseover={() => setHovered(!disable() && true)}
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
