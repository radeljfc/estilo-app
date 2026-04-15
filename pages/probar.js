import { useState, useEffect } from "react";
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
import { useRouter } from "next/router";

export default function Probar() {
  const router = useRouter();

  const { estilo: estiloQuery } = router.query;

  const [estiloSeleccionado, setEstiloSeleccionado] = useState("urbano");
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [estilo, setEstilo] = useState(null);
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [intento, setIntento] = useState(false);
  useEffect(() => {
    if (estiloQuery) {
      setEstiloSeleccionado(estiloQuery);
    }
  }, [estiloQuery]);

  const cambiarEstilo = (nuevoEstilo) => {
    setEstiloSeleccionado(nuevoEstilo);
    router.push(`/probar?estilo=${nuevoEstilo}`);
  };

  const handleImage = (file) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageBase64(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const enviar = async () => {
    try {
      setLoading(true);
      setIntento(true);
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput.files[0];

      if (!file) {
        alert("Primero sube una imagen");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Estiloapp");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/djk1h8mkc/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const cloudData = await cloudRes.json();

      const uploadedUrl = cloudData.secure_url;

      const res = await fetch("/api/generar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageUrl: uploadedUrl,
          estilo: estiloSeleccionado
        })
      });

      const data = await res.json();
console.log("RESPUESTA IA:", data);
setResult({
  user: data.image,
  outfit: data.outfit
});
      setEstilo(data.estilo);
      setPrendas(data.prendas);

    } catch (error) {
      console.error(error);
      alert("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => window.location.href = "/"}>
        Volver al inicio
      </button>

      <h2>Prueba tu estilo</h2>

      <h3>Selecciona un estilo:</h3>

<div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
  {estilosDisponibles.map((est) => (
    <div 
      key={est.id}
      style={{
        border: "1px solid #ccc",
        borderRadius: 10,
        padding: 10,
        width: 150,
        textAlign: "center"
      }}
    >
      <img 
        src={est.imagen} 
        width="100%" 
        style={{ borderRadius: 10 }}
      />

      <p>{est.nombre}</p>

      <button onClick={() => cambiarEstilo(est.id)}>
        Probar
      </button>
    </div>
  ))}
</div>

      <br /><br />

      <input 
        type="file" 
        onChange={(e) => handleImage(e.target.files[0])}
      />

      <br /><br />

      <button onClick={enviar}>
        {loading ? "Generando..." : "Generar estilo"}
      </button>

{result && (
  <div>
    <h3>Resultado:</h3>

    <div style={{ position: "relative", width: 250 }}>
  <img 
    src={result.user} 
    width="250" 
    style={{ borderRadius: 10 }}
  />

  <img 
    src={result.outfit} 
    width="250"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      opacity: 0.6,
      borderRadius: 10
    }}
  />
</div>
  </div>
)}

{intento && !result && !loading && (
  <p>No se pudo generar imagen</p>
)}

      {estilo && (
        <div>
          <h3>Estilo: {estilo}</h3>
        </div>
      )}

      {prendas.length > 0 && (
        <div>
          <h4>Prendas recomendadas:</h4>
<div>
{prendas.length > 0 && (
  <div>
    <h4>Prendas recomendadas:</h4>

    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {prendas.map((p, i) => (
        <div 
          key={i} 
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 10,
            width: 150,
            textAlign: "center"
          }}
        >
          <img 
            src={p.imagen} 
            width="100%" 
            style={{ borderRadius: 10 }}
          />

          <p><strong>{p.nombre}</strong></p>
          <p>{p.precio}</p>

          <a href={p.link} target="_blank">
            <button>Comprar</button>
          </a>
        </div>
      ))}
    </div>
  </div>
)} 
    </div>
  );
}
