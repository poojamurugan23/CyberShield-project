export default function Toast({ msg }) {
  return (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      background: "#00e5ff",
      padding: 10,
      borderRadius: 10
    }}>
      {msg}
    </div>
  );
}