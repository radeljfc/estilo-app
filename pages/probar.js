import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Probar() {
  const router = useRouter();
  const { estilo: estiloId } = router.query;

  // ESTADOS
  const [estiloSeleccionado, setEstiloSeleccionado] = useState(null);
  const [result, setResult] = useState(null);
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [tallaSugerida, setTallaSugerida] = useState("");

  // Cargar datos del estilo desde Supabase
  useEffect(() => {
    if (estiloId) {
      async function cargarEstilo() {
        const { data } = await supabase.from('estilos').select('*').eq('id', estiloId).single();
        if (data) {
          setEstiloSeleccionado(data);
          setPrendas(data.prendas || []);
        }
      }
      cargarEstilo();
    }
  }, [estiloId]);

  const calcularTallaSugerida = (a, p) => {
    if (!a || !p) return "";
    const imc = p / ((a / 100) ** 2);
    if (imc < 20) return "S";
    if (imc < 25) return "M";
    if (imc < 30) return "L";
    return "XL";
  };

  const enviar = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (!file) return alert("Sube una foto");
    if (!altura || !peso) return alert("Por favor, ingresa tu altura y peso para sugerirte la mejor talla.");

    setLoading(true);
    try {
      // 1. Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Estiloapp");
      
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/djk1h8mkc/image/upload", { 
        method: "POST", 
        body: formData 
      });
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) throw new Error("Error al subir imagen");

      // 2. Generar con IA
      const res = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageUrl: cloudData.secure_url, 
          estilo: estiloSeleccionado.nombre 
        })
      });
      const data = await res.json();

      // 3. Polling
      let status = "starting";
      let finalData = null;
      while (status !== "succeeded" && status !== "failed") {
        const checkRes = await fetch(`/api/verificar?id=${data.predictionId}`);
        finalData = await checkRes.json();
        status = finalData.status;
        if (status === "failed") throw new Error("La IA falló.");
        await new Promise(r => setTimeout(r, 3000));
      }

      // 4. Resultado
      const urlFinal = Array.isArray(finalData.output) ? finalData.output[finalData.output.length - 1] : finalData.output;
      setResult(urlFinal);

    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <button onClick={() => router.push("/")} style={{ border: 'none', background: 'none', color: '#0070f3', fontSize: '16px', marginBottom: '20px' }}> ← Volver </button>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Tu Probador VESTA</h2>
      
      {/* SECCIÓN DATOS Y SUBIDA */}
      <section style={{ marginBottom: '30px', backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>1. Tus medidas:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input type="number" placeholder="Altura (cm)" value={altura} onChange={(e) => { setAltura(e.target.value); setTallaSugerida(calcularTallaSugerida(e.target.value, peso)); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
          <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => { setPeso(e.target.value); setTallaSugerida(calcularTallaSugerida(altura, e.target.value)); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>

        {tallaSugerida && (
          <p style={{ backgroundColor: '#eef6ff', color: '#0070f3', padding: '10px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>
            Talla recomendada: <strong>{tallaSugerida}</strong>
          </p>
        )}

        <h3 style={{ fontSize: '18px', margin: '20px 0 15px' }}>2. Sube tu foto:</h3>
        <input type="file" accept="image/*" style={{ marginBottom: '20px', width: '100%' }} />
        
        <button onClick={enviar} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold', border: 'none' }}>
          {loading ? `IA trabajando...` : "Ver mi Look"}
        </button>
      </section>

      {/* RESULTADO E IA */}
      {result && (
        <section style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={result} style={{ width: '100%', maxWidth: '400px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
          
          <h3 style={{ marginTop: '30px', fontSize: '20px' }}>Prendas del Look:</h3>
          {prendas.map((prenda) => (
            <div key={prenda.id} style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '15px', textAlign: 'left', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{prenda.nombre}</span>
                <span style={{ color: '#0070f3' }}>{prenda.precio} {prenda.moneda}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {['S', 'M', 'L', 'XL'].map(t => (
                  <div key={t} style={{ padding: '5px 10px', borderRadius: '5px', fontSize: '12px', border: t === tallaSugerida ? '2px solid #000' : '1px solid #eee', color: prenda.stock[t] > 0 ? '#000' : '#ccc' }}>
                    {t} {t === tallaSugerida && "⭐"}
                  </div>
                ))}
              </div>
              <button 
                disabled={!prenda.stock[tallaSugerida]}
                style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', backgroundColor: prenda.stock[tallaSugerida] > 0 ? '#0070f3' : '#ccc', color: '#fff', border: 'none' }}
              >
                {prenda.stock[tallaSugerida] > 0 ? `Comprar Talla ${tallaSugerida}` : "Agotado en tu talla"}
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
