import { serverUrl } from "@/utils/tmpConsts"

export default async function fetchFlag(
  flagId: string,
  headers: HeadersInit
): Promise<boolean> {
  return fetch(`${serverUrl}/api/feature-enabled/${flagId}`, {
    headers: headers
  })
    .then(async r => await r.json())
    .then(j => j.flagEnabled)
    .catch((e) => { console.error(e) })
}
