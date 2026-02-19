import { useEffect, useState } from "react"
import fetchFlag from "../utils/fetchFlag";

export default function UserInfo() {
  const email = "user@mail.com";
  const organization = "Stoke Space"
  const headers = {
    "X-Email": email,
    "X-Organization": organization
  }

  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);

  useEffect(() => {
    fetchFlag("user-info", headers)
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
