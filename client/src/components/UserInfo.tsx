import { useEffect, useState } from "react"

export default function UserInfo() {
  const email = "user@mail.com";
  const organization = "Stoke Space"

  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3070/api/flag/show-user", {
      headers: {
        "X-Email": email,
        "X-Organization": organization
      }
    })
      .then(async r => await r.json())
      .then(j => j.flagEnabled)
      .then(setFeatureFlagEnabled)
  }, [])

  return (
    <>
      <h1>User Information</h1>
      <p>
        {featureFlagEnabled ? "true" : "false"}
      </p>
    </>
  )
}
