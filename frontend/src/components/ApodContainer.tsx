import { serverUrl } from "@/utils/tmpConsts";
import type Apod from "@backend-types/apod"
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

type ApodDisplayState = "loading" | Apod;

const APOD_URL = "https://apod.nasa.gov"

// Dependency list tells the container what variables to refresh on
export default function ApodContainer({ date }: { date: Date }) {
  const [displayState, setDisplayState] = useState<ApodDisplayState>("loading");

  useEffect(() => {
    setDisplayState("loading");
    const today = date.getDate() === new Date().getDate();
    const endpoint = today ? "apod/today" : "apod"
    fetch(`${serverUrl}/api/${endpoint}`, {
      method: today ? "GET" : "POST",
      headers: today ? undefined : {
        "Content-Type": "application/json"
      },
      body: today ? undefined : JSON.stringify({ date: date })
    })
      .then(async r => await r.json())
      .then(setDisplayState);
  }, [date])

  return displayState === "loading" ? (
    <h1>Loading Astronomy Picture of the Day...</h1>
  ) : (
    <ApodDisplay apod={displayState} />
  )
}

function ApodDisplay({ apod }: { apod: Apod }) {
  // Omit date for now, we'll handle that above this level
  const imageCredits = apod.credits.image;
  const textCredits = apod.credits.text;

  return (
    <>
      <h1>{apod.title}</h1>
      <img src={`${APOD_URL}/${apod.imageLink}`} alt={apod.title} />
      <p>
        Image Credit:
        <ul>
          {imageCredits.map((e) =>
            <li key={`imgCredit-${e.name}`}><a href={e.link}>{e.name}</a></li>
          )}
        </ul>
      </p>
      {/* We can trust this HTML because we sanitized it */}
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(apod.description) as string) }} />
      {textCredits && (<p>
        Text Credit: <a href={textCredits.link}>{textCredits.name}</a>
      </p>)}
    </>
  )
}

