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
        <h1
          class="h-[100vh] text-center my-20 text-4xl"
        >
          Loading Astronomy Picture of the Day...
        </h1>
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
      <a href={`${APOD_URL}/${apod.imageLink}`} >
        <img
          class="mx-auto min-h-[80vh]"
          src={`${APOD_URL}/${apod.imageLink}`}
          alt={apod.title}
        />
      </a>
      <article class="my-4 max-w-[80ch] mx-auto">
        <h1 class="font-bold text-2xl">{apod.title}</h1>
        <i class="text-xl">
          Credit{apod.copyright && " & Copyright"}:
          {imageCredits().map((e, i) =>
            <a href={e.link}>{i != 0 && ","} {e.name}</a>
          )}
        </i>
        <p
          class="my-4"
          innerHTML={DOMPurify.sanitize(marked.parse(apod.description) as string)}
        />
        {textCredits() && (<small>
          Text Credit: <a href={textCredits()!.link}>{textCredits()!.name}</a>
        </small>)}
      </article>
    </>
  )
}

