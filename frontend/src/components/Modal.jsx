export default function Modal({ data, close }) {
  return (
    <div className="glass">
      <h3>Case Details</h3>
      <p>{data.description}</p>
      <p>Hash: {data.hash}</p>

      <button onClick={close}>Close</button>
    </div>
  );
}