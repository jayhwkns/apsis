import { useEffect, useState } from "react"

export default function UserInfo() {
  const email = "user@mail.com";
  const organization = "Stoke Space"

  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3070/api/feature-enabled/show-user", {
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
      {featureFlagEnabled ?
        (<>
          <h2>Email:</h2>{email}
          <h2>Organization:</h2>{organization}
        </>)
        :
        <p>Feature coming soon!</p>
      }
    </>
  )
}
