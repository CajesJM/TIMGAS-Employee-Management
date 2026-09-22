"use client";

import { useState } from "react";

export function SettingsControls() {
  const [contractAlerts, setContractAlerts] = useState(true);
  const [leaveAlerts, setLeaveAlerts] = useState(true);

  return (
    <div className="settings-list">
      <div className="settings-row"><div><strong>Contract expiration alerts</strong><p>Show upcoming contract deadlines on the command center.</p></div><button type="button" className={`toggle ${contractAlerts ? "toggle--on" : ""}`} aria-pressed={contractAlerts} aria-label="Toggle contract expiration alerts" onClick={() => setContractAlerts((value) => !value)} /></div>
      <div className="settings-row"><div><strong>Pending leave alerts</strong><p>Highlight leave requests waiting for manager review.</p></div><button type="button" className={`toggle ${leaveAlerts ? "toggle--on" : ""}`} aria-pressed={leaveAlerts} aria-label="Toggle pending leave alerts" onClick={() => setLeaveAlerts((value) => !value)} /></div>
    </div>
  );
}
