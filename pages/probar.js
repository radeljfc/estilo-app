import { useState, useEffect } from "react";
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

      setResult(data.image);
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

      <button onClick={() => cambiarEstilo("urbano")}>
        Urbano
      </button>

      <button onClick={() => cambiarEstilo("elegante")}>
        Elegante
      </button>

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
          <img src={result} width="300" />
        </div>
      )}

      {estilo && (
        <div>
          <h3>Estilo: {estilo}</h3>
        </div>
      )}

      {prendas.length > 0 && (
        <div>
          <h4>Prendas recomendadas:</h4>
          <ul>
            {prendas.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
