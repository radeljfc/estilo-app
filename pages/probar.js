import { useState } from "react";

export default function Probar() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/generar", {
        method: "POST"
      });

      const data = await res.json();
      setResult(data.image);

    } catch (error) {
      console.error(error);
      alert("Error al generar");
    } finally {
      setLoading(false);
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
