import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  return (
    <div className="glass">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {file && <p>Uploaded: {file.name}</p>}
    </div>
  );
}