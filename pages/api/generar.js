export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta el token en Vercel (REPLICATE_API_TOKEN)" });

  const { imageUrl, estilo } = req.body;
  
  // Fotos de las prendas (Urbano vs Elegante)
  const garmImg = estilo === "elegante" 
    ? "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce" 
    : "https://images.unsplash.com/photo-1520975916090-3105956dac38";

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ESTA ES LA VERSIÓN QUE TE FUNCIONÓ EN LA WEB
        version: "0513734a81fd5382025816922cf90082f4d38c62c3e41df473950b7308d278bd",
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: "clothing item",
          is_checked: true
        }
      })
    });

    const data = await response.json();

    if (data.detail) {
      return res.status(422).json({ success: false, error: "Replicate dice: " + data.detail });
    }

    return res.status(200).json({
      success: true,
      predictionId: data.id,
      // Datos del catálogo directo para evitar errores de archivo
      prendas: [
        { nombre: "Chaqueta VESTA", precio: "$45", imagen: garmImg, link: "#" }
      ]
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
