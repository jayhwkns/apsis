import { useEffect, useState } from "react";
import fetchFlag from "../utils/fetchFlag";
import { defaultHeaders, serverUrl } from "../utils/tmpConsts";

type FlagTable = Record<string, boolean>;

export default function FlagInfo() {
  const [featureFlagEnabled, setFeatureFlagEnabled] = useState(false);

  const [flagTable, setFlagTable] = useState<FlagTable>({});

  // Check if feature flag is enabled
  useEffect(() => {
    fetchFlag("flag-info", defaultHeaders)
      .then(setFeatureFlagEnabled)
  }, [])

  // Load data for feature
  useEffect(() => {
    // Skip fetch if feature flag is disabled
    if (!featureFlagEnabled) return;

    fetch(`${serverUrl}/api/feature-flag-table`, {
      headers: defaultHeaders
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
            <thead>
              <tr>
                <th>Feature Flag</th>
                <th>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(flagTable).map(e =>
                <tr key={`feature-flag-row-${e}`}>
                  <td>{e[0]}</td>
                  <td>{e[1] ? "true" : "false"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>Feature coming soon!</p>
      )}
    </>
  )
}
