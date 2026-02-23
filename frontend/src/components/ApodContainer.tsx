import { serverUrl } from "@/utils/tmpConsts";
import mdToApod from "@/utils/mdToApod";
import type Apod from "@backend-types/apod"
import DOMPurify from "dompurify";
import { marked } from "marked";
import { createResource, Match, Switch } from 'solid-js'
import type { Accessor } from "solid-js";

const APOD_URL = "https://apod.nasa.gov"

// Dependency list tells the container what variables to refresh on
export default function ApodContainer({ date }: { date: Accessor<Date> }) {
  const [apod] = createResource(date, async () => {
    const today = date().getDate() === new Date().getDate();
    const endpoint = today ? "apod/today" : "apod"
    return fetch(`${serverUrl}/api/${endpoint}`, {
      method: today ? "GET" : "POST",
      headers: today ? undefined : {
        "Content-Type": "application/json"
      },
      body: today ? undefined : JSON.stringify({ date: date() })
    })
      .then(async r => mdToApod(await r.text()))
  })

  return (
    <Switch>
      <Match when={apod.loading}>
        <h1>Loading Astronomy Picture of the Day...</h1>
      </Match>
      <Match when={!apod.loading && apod()}>
        <ApodDisplay apod={apod()!} />
      </Match>
    </Switch>
  )
}

function ApodDisplay({ apod }: { apod: Apod }) {
  const imageCredits = () => apod.credits.image;
  const textCredits = () => apod.credits.text;

  return (
    <>
      <h1>{apod.title}</h1>
      <img src={`${APOD_URL}/${apod.imageLink}`} alt={apod.title} />
      Image Credit{apod.copyright && " & Copyright"}:
      <ul>
        {imageCredits().map((e) =>
          <li><a href={e.link}>{e.name}</a></li>
        )}
      </ul>
      <p innerHTML={DOMPurify.sanitize(marked.parse(apod.description) as string)}></p>
      {textCredits() && (<p>
        Text Credit: <a href={textCredits()!.link}>{textCredits()!.name}</a>
      </p>)}
    </>
  )
}

