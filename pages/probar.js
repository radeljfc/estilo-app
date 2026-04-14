import { useState } from "react";

export default function Probar() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const enviar = async () => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch("/api/generar", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  setResult(data.image);
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Sube tu foto</h2>

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button onClick={enviar}>Generar estilo</button>

      {result && <img src={result} width="300" />}
    </div>
  );
}
