import { useState } from "react";

export default function Probar() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/generar", {
        method: "POST"
      });

      const data = await res.json();

      if (data.image) {
        setResult(data.image);
      } else {
        alert("No se generó imagen");
      }

    } catch (error) {
      console.error(error);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba tu estilo</h2>

      <button onClick={enviar}>
        {loading ? "Generando..." : "Generar estilaaa"}
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
