export default function DateDisplay(
  { date, setDate }: { date: Date, setDate: React.Dispatch<React.SetStateAction<Date>> }
) {
  const monthName = date.toLocaleDateString("default", { month: "long" });
  const day = ordinalSuffix(date.getDate());
  return (
    <div>
      {/* This line looks terrible, but it makes sense trust.
        setDate() in the Date class takes care of overflow and underflow with
        the months, while setDate() takes care of the React state.
        Date constructor is needed because date.setDate returns a number
      */}
      <button onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}> Yesterday </button>
      {`${date.getFullYear()} ${monthName} ${day}`}
      <button onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}> Tomorrow </button>
    </div>
  )
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
