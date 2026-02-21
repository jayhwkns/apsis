import { serverUrl } from "@/utils/tmpConsts";
import type Apod from "@backend-types/apod"
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

type ApodDisplayState = "loading" | Apod;

const APOD_URL = "https://apod.nasa.gov"

export default function ApodContainer() {
  const [displayState, setDisplayState] = useState<ApodDisplayState>("loading");

  useEffect(() => {
    fetch(`${serverUrl}/api/apod/today`)
      .then(async r => await r.json())
      .then(setDisplayState);
  }, [])

  return displayState == "loading" ? (
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
      <img src={`${APOD_URL}/${apod.imageLink}`} />
      <p>
        Image Credit: <a href={imageCredits.link}>{imageCredits.name}</a>
      </p>
      {/* We can trust this HTML because we sanitized it */}
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(apod.description) as string) }} />
      <p>
        Text Credit: <a href={textCredits.link}>{textCredits.name}</a>
      </p>
    </>
  )
}

