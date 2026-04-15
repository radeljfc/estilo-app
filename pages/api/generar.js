// pages/api/generar.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta REPLICATE_API_TOKEN en Vercel" });

  try {
    const { imageUrl, estilo } = req.body;

    // 1. Fotos de prendas por defecto (para Urbano vs Elegante)
    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38", // Prenda urbana por defecto
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"  // Prenda elegante por defecto
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // 2. LLAMADA DIRECTA AL MODELO (sin depender de una ID de versión)
    const response = await fetch("https://api.replicate.com/v1/models/cuuupid/idm-vton/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: "clothing item",
          is_checked: true
        }
      })
    });

    const data = await response.json();

    // Si Replicate nos da un error, lo atrapamos y lo mostramos
    if (data.detail) {
      return res.status(422).json({ success: false, error: "Replicate dice: " + data.detail });
    }

    return res.status(200).json({
      success: true,
      predictionId: data.id,
      estilo: estilo,
      // 3. Catálogo "en línea" para evitar errores de archivo
      prendas: [
        { nombre: `Look VESTA ${estilo}`, precio: "$0 (Prueba)", imagen: garmImg, link: "#" }
      ]
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Error de servidor: " + error.message });
  }
}
