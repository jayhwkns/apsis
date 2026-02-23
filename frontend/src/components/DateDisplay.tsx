import type { Accessor, Setter } from "solid-js";

export default function DateDisplay(
  { date, setDate }: { date: Accessor<Date>, setDate: Setter<Date> }
) {
  const monthName = () => date().toLocaleDateString("default", { month: "long" });
  const day = () => ordinalSuffix(date().getDate());
  const today = () => isToday(date());
  return (
    <div>
      {/* This line looks terrible, but it makes sense trust.
        setDate() in the Date class takes care of overflow and underflow with
        the months, while setDate() takes care of the React state.
        Date constructor is needed because date.setDate returns a number
      */}
      <button onClick={() => setDate(new Date(date().setDate(date().getDate() - 1)))}> Yesterday </button>
      {`${date().getFullYear()} ${monthName()} ${day()}`}
      {today() ? " (Today)" : ""}
      <button disabled={today()} onClick={() => setDate(new Date(date().setDate(date().getDate() + 1)))}> Tomorrow </button>
    </div>
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
