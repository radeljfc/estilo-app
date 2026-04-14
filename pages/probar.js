<h2>Sube tu foto v2</h2>
import { useState } from "react";

export default function Probar() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

 const enviar = async () => {
  alert("botón funcionando2 ");

  try {
    const res = await fetch("/api/generar", {
      method: "POST"
    });

    const data = await res.json();
    setResult(data.image);

  } catch (error) {
    alert("error en fetch");
    console.error(error);
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Sube tu foto</h2>

      <input 
        type="file" 
        onChange={(e) => {
          console.log("imagen seleccionada");
          setImage(e.target.files[0]);
        }} 
      />

      <button onClick={enviar} disabled={loading}>
        {loading ? "Generando..." : "Generar estilo"}
      </button>

      {result && (
        <div>
          <h3>Resultado:</h3>
          <img src={result} width="300" />
        </div>
      )}
    </div>
  );
}
