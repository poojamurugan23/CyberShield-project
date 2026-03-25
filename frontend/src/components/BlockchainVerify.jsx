import { useState } from "react";

export default function BlockchainVerify({ hash }) {
  const [status, setStatus] = useState(null);

  const verify = () => {
    setStatus("Verified ✅");
  };

  return (
    <div className="glass">
      <p>Hash: {hash}</p>
      <button onClick={verify}>Verify</button>
      {status && <p>{status}</p>}
    </div>
  );
}