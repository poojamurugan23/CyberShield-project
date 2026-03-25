export default function CaseCard({ c }) {
  return (
    <div className="glass">
      <h4>{c.domain}</h4>
      <p>{c.description}</p>
      <p>Hash: {c.hash}</p>
    </div>
  );
}