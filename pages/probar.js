import { useState } from "react";

export default function Probar() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    try {
      setLoading(true);

      // 1. Crear predicción
      const res = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": "Token r8_EMN4C99gmYJzVPZEpDD149Ioimt1Z6z2jnglv",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          version: "stability-ai/sdxl",
          input: {
            prompt: "a fashionable man wearing a modern urban outfit, realistic photo"
          }
        })
      });

      const data = await res.json();

      // 2. Consultar resultado
      if (data?.urls?.get) {
        let output = null;

        // Polling simple (esperar resultado)
        for (let i = 0; i < 10; i++) {
          const resultRes = await fetch(data.urls.get, {
            headers: {
              "Authorization": "Token r8_EMN4C99gmYJzVPZEpDD149Ioimt1Z6z2jnglv"
            }
          });

          const resultData = await resultRes.json();

          if (resultData.status === "succeeded") {
            output = resultData.output[0];
            break;
          }

          await new Promise(r => setTimeout(r, 1500));
        }

        setResult(output);
      }

    } catch (error) {
      console.error(error);
      alert("Error generando imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba tu estilo</h2>

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
