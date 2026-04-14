 {result && (
  <div>
    <button onClick={() => window.location.href = "/"}>
      Volver al inicio
    </button>

    <h3>Resultado:</h3>
    <img src={result} width="300" />
  </div>
)}
import { useState } from "react";

export default function Probar() {
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

    // 1. Subir imagen a Cloudinary
    const formData = new FormData();
    formData.append("file", document.querySelector('input[type="file"]').files[0]);
    formData.append("upload_preset", "Estiloapp");

    const cloudRes = await fetch(
      "https://api.cloudinary.com/v1_1/djk1h8mkc/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const cloudData = await cloudRes.json();

    const imageUrl = cloudData.secure_url;

    // 2. Enviar URL al backend
    const res = await fetch("/api/generar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageUrl
      })
    });

    const data = await res.json();
    setResult(data.image);

  } catch (error) {
    console.error(error);
    alert("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Prueba tu estilo</h2>

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
    </div>
  );
}
