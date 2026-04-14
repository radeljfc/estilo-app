import { useState } from "react";

export default function Probar() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    alert("click detectado");

    try {
      setLoading(true);

      const res = await fetch("/api/generar", {
        method: "POST"
      });

      const data = await res.json();

      setResult(data.image);

    } catch (error) {
      alert("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba tu estilo v3</h2>

      {/* INPUT TOTALMENTE AISLADO */}
      <input type="file" />

      <br /><br />

      <button onClick={enviar}>
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
