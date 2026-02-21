import { serverUrl } from "@/utils/tmpConsts";
import type Apod from "@backend-types/apod"
import { useEffect, useState } from "react";

type ApodDisplayState = "loading" | Apod;

const APOD_URL = "https://apod.nasa.gov"

export default function ApodDisplay() {
  const [displayState, setDisplayState] = useState<ApodDisplayState>("loading");

  useEffect(() => {
    fetch(`${serverUrl}/api/apod/today`)
      .then(async r => await r.json())
      .then(setDisplayState)
  }, [])

  return displayState == "loading" ? (
    <h1>Loading Astronomy Picture of the Day...</h1>
  ) : (
    <img src={`${APOD_URL}/${displayState.imageLink}`} />
  )
}
