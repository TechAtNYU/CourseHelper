import { useState } from "react";

function IndexSidePanel() {
  const [data, setData] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
      }}
    >
      <h2>Welcome to your Extension!</h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
    </div>
  );
}

export default IndexSidePanel;
