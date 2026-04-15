import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const estilosDisponibles = [
  {
    id: "urbano",
    nombre: "Urbano Moderno",
    imagen: "https://images.unsplash.com/photo-1520975916090-3105956dac38"
  },
  {
    id: "elegante",
    nombre: "Elegante Casual",
    imagen: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
  }
];

export default function Probar() {
  const router = useRouter();
  const { estilo: estiloQuery } = router.query;

  const [estiloSeleccionado, setEstiloSeleccionado] = useState("urbano");
  const [result, setResult] = useState(null);
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  // Cargar historial y estilo inicial
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
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/djk1h8mkc/image/upload", { method: "POST", body: formData });
      const cloudData = await cloudRes.json();

      // 2. Pedir a la IA que empiece
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: cloudData.secure_url, estilo: estiloSeleccionado })
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      // 3. Bucle de espera (Polling)
      let status = "starting";
      let finalResult = null;
      let intentos = 0;

      while (status !== "succeeded" && status !== "failed" && intentos < 60) {
        intentos++;
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        
        const check = await fetch(`/api/verificar?id=${data.predictionId}`);
        const checkData = await check.json();
        
        status = checkData.status;
        console.log("Estado actual:", status);

        if (status === "succeeded") {
          finalResult = checkData.output[0];
          break; 
        }
        
        if (status === "failed") {
          throw new Error("La IA falló al procesar la imagen.");
        }
      }

      if (finalResult) {
        setResult(finalResult);
        setPrendas(data.prendas);

        // GUARDAR EN HISTORIAL
        const nuevoLook = {
          imagen: finalResult,
          estilo: estiloSeleccionado,
          fecha: new Date().toLocaleDateString()
        };
        const actualizado = [nuevoLook, ...historial].slice(0, 10);
        setHistorial(actualizado);
        localStorage.setItem("vesta_historial", JSON.stringify(actualizado));
      } else {
        alert("La IA está tardando demasiado. Revisa tu panel de Replicate.");
      }

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <button onClick={() => router.push("/")} style={{ border: 'none', background: 'none', color: '#0070f3', fontSize: '16px', marginBottom: '20px' }}>
        ← Volver
      </button>

      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Refina tu Estilo</h2>
      
      <section style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', color: '#666' }}>1. Selecciona la tendencia:</h3>
        <div style={{ display: "flex", gap: '15px', overflowX: 'auto', padding: '10px 0' }}>
          {estilosDisponibles.map((est) => (
            <div 
              key={est.id}
              onClick={() => setEstiloSeleccionado(est.id)}
              style={{
                flex: '0 0 140px',
                border: estiloSeleccionado === est.id ? '2px solid #0070f3' : '1px solid #ddd',
                borderRadius: '15px',
                padding: '10px',
                textAlign: "center",
                backgroundColor: '#fff',
                cursor: 'pointer'
              }}
            >
              <img src={est.imagen} width="100%" style={{ borderRadius: '10px', height: '120px', objectFit: 'cover' }} />
              <p style={{ marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>{est.nombre}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>2. Sube tu foto:</h3>
        <input type="file" accept="image/*" style={{ marginBottom: '20px', width: '100%' }} />
        <button 
          onClick={enviar}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '12px',
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none'
          }}
        >
          {loading ? `IA trabajando... (Espera un momento)` : "Generar Mi Look"}
        </button>
      </section>

      {/* RESULTADO ACTUAL */}
      {result && (
        <section style={{ marginTop: '30px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '15px', fontWeight: 'bold' }}>Tu Resultado VESTA:</h3>
          <img src={result} style={{ width: '100%', maxWidth: '400px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }} />
          
          {prendas.length > 0 && (
            <div style={{ marginTop: '40px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '20px', marginBottom: '15px' }}>Compra el Look:</h4>
              <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {prendas.map((p, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '15px', border: '1px solid #eee' }}>
                    <img src={p.imagen} width="100%" style={{ borderRadius: '10px' }} />
                    <p style={{ margin: '8px 0 2px', fontWeight: 'bold' }}>{p.nombre}</p>
                    <p style={{ color: '#0070f3', marginBottom: '10px' }}>{p.precio}</p>
                    <a href={p.link} target="_blank" style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #000', backgroundColor: 'transparent', fontWeight: 'bold' }}>Pedir</button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* HISTORIAL */}
      {historial.length > 0 && (
        <section style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Tus Pruebas Anteriores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
            {historial.map((look, index) => (
              <div key={index} onClick={() => setResult(look.imagen)} style={{ cursor: 'pointer' }}>
                <img src={look.imagen} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px' }} />
                <p style={{ fontSize: '10px', textAlign: 'center', marginTop: '5px', color: '#666' }}>{look.estilo}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
