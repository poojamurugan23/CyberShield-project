export default function AIResult({ domain }) {
  return (
    <div className="glass">
      <h3>AI Result</h3>
      <p>Detected Attack: <b>{domain}</b></p>
    </div>
  );
}