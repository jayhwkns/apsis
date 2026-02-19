export default async function fetchFlag(
  flagId: string,
  headers: HeadersInit
): Promise<boolean> {
  return fetch(`http://localhost:3070/api/feature-enabled/${flagId}`, {
    headers: headers
  })
    .then(async r => await r.json())
    .then(j => j.flagEnabled)
    .catch((e) => { console.error(e) })
}
