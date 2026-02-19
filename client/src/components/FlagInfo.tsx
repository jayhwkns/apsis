import { useEffect, useState } from "react";

type FlagTable = Record<string, boolean>;

export default function FlagInfo() {
  const email = "user@mail.com";
  const organization = "Stoke Space"

  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);

  const [flagTable, setFlagTable] = useState<FlagTable>({});

  // Check if feature flag is enabled
  useEffect(() => {
    fetch("http://localhost:3070/api/feature-enabled/flag-info", {
      headers: {
        "X-Email": email,
        "X-Organization": organization
      }
    })
      .then(async r => await r.json())
      .then(j => j.flagEnabled)
      .then(setFeatureFlagEnabled)
      .catch((e) => { console.error(e) })
  }, [])

  // Load data for feature
  useEffect(() => {
    // Skip fetch if feature flag is disabled
    if (!featureFlagEnabled) return;

    fetch("http://localhost:3070/api/feature-flag-table", {
      headers: {
        "X-Email": email,
        "X-Organization": organization
      }
    })
      .then(async r => await r.json())
      .then(setFlagTable)
      .catch((e) => { console.error(e) })
  }, [featureFlagEnabled])

  return (
    <>
      <h1>Feature Flag Information</h1>
      {featureFlagEnabled ? (
        <>
          <table>
            <tr>
              <th>Feature Flag</th>
              <th>Enabled</th>
            </tr>
            {Object.entries(flagTable).map(e =>
              <tr>
                <td>{e[0]}</td>
                <td>{e[1] ? "true" : "false"}</td>
              </tr>
            )}
          </table>
        </>
      ) : (
        <p>Feature coming soon!</p>
      )}
    </>
  )
}
