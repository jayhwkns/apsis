import fetchFlag from "@/utils/fetchFlag";
import { defaultEmail, defaultHeaders, defaultOrganization } from "../utils/tmpConsts";
import { createEffect, createSignal } from "solid-js";

export default function UserInfo() {
  const [featureFlagEnabled, setFeatureFlagEnabled] = createSignal(false);

  createEffect(() => {
    fetchFlag("user-info", defaultHeaders)
      .then(setFeatureFlagEnabled)
  }, [])

  return (
    <>
      <h1>User Information</h1>
      {featureFlagEnabled() ?
        (<>
          <h2>Email:</h2>{defaultEmail}
          <h2>Organization:</h2>{defaultOrganization}
        </>)
        :
        <p>Feature coming soon!</p>
      }
    </>
  )
}
