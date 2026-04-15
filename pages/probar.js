import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const estilosDisponibles = [
  { id: "urbano", nombre: "Urbano Moderno", imagen: "https://images.unsplash.com/photo-1520975916090-3105956dac38" },
  { id: "elegante", nombre: "Elegante Casual", imagen: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce" }
];

export default function Probar() {
  const router = useRouter();
  const { estilo: estiloQuery } = router.query;

  const [estiloSeleccionado, setEstiloSeleccionado] = useState("urbano");
  const [result, setResult] = useState(null);
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("vesta_historial") || "[]");
    setHistorial(guardados);
    if (estiloQuery) setEstiloSeleccionado(estiloQuery);
  }, [estiloQuery]);

  const enviar = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) return alert("Sube una foto");

    setLoading(true);
    try {
      // 1. Subida a Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Estiloapp");
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/djk1h8mkc/image/upload", { 
        method: "POST", 
        body: formData 
      });
      
      const cloudData = await cloudRes.json();
      
      if (!cloudData.secure_url) {
        throw new Error("Cloudinary no devolvió URL. Revisa tu preset.");
      }
      alert("Foto subida con éxito!");

      // 2. Llamada a la API Generar
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: cloudData.secure_url, estilo: estiloSeleccionado })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // 3. Polling (Espera a Replicate)
      let status = "starting";
      let finalData = null;

      while (status !== "succeeded" && status !== "failed") {
        const checkRes = await fetch(`/api/verificar?id=${data.predictionId}`);
        finalData = await checkRes.json();
        status = finalData.status;
        if (status === "failed") throw new Error("La IA falló al procesar.");
        if (status !== "succeeded") await new Promise(r => setTimeout(r, 3000));
      }

      // 4. Mostrar Resultado
      if (finalData && finalData.output) {
        // CORRECCIÓN AQUÍ: Definimos la variable correctamente
        const urlFinal = Array.isArray(finalData.output) 
          ? finalData.output[finalData.output.length - 1] 
          : finalData.output;
        
        setResult(urlFinal);
        setPrendas(data.prendas || []);

        const nuevoHistorial = [{ imagen: urlFinal, estilo: estiloSeleccionado }, ...historial].slice(0, 10);
        setHistorial(nuevoHistorial);
        localStorage.setItem("vesta_historial", JSON.stringify(nuevoHistorial));
      }

    } catch (error) {
      alert("DETALLE: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <button onClick={() => router.push("/")} style={{ border: 'none', background: 'none', color: '#0070f3', fontSize: '16px', marginBottom: '20px' }}> ← Volver </button>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Refina tu Estilo</h2>
      
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', color: '#666' }}>1. Selecciona la tendencia:</h3>
        <div style={{ display: "flex", gap: '15px', overflowX: 'auto', padding: '10px 0' }}>
          {estilosDisponibles.map((est) => (
            <div key={est.id} onClick={() => setEstiloSeleccionado(est.id)} style={{ flex: '0 0 140px', border: estiloSeleccionado === est.id ? '2px solid #0070f3' : '1px solid #ddd', borderRadius: '15px', padding: '10px', textAlign: "center", backgroundColor: '#fff' }}>
              <img src={est.imagen} width="100%" style={{ borderRadius: '10px', height: '120px', objectFit: 'cover' }} />
              <p style={{ marginTop: '8px', fontSize: '14px' }}>{est.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>2. Sube tu foto:</h3>
        <input type="file" accept="image/*" style={{ marginBottom: '20px', width: '100%' }} />
        <button onClick={enviar} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
          {loading ? `IA trabajando...` : "Generar Mi Look"}
        </button>
      </section>

      {result && (
        <section style={{ marginTop: '30px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>¡Tu Look está listo!</h3>
          <img 
            src={result} 
            key={result}
            style={{ width: '100%', maxWidth: '400px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} 
            onError={(e) => {
              setTimeout(() => { e.target.src = result + "?t=" + new Date().getTime(); }, 2000);
            }}
          />
        </section>
      )}
    </div>
  );
}
