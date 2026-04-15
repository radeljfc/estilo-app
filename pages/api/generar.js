export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta el Token en Vercel" });

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // LLAMADA ESTÁNDAR POR VERSIÓN (La más compatible)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Versión específica del modelo IDM-VTON
        version: "0513734a81fd5382025816922cf90082f4d38c62c3e41df473950b7308d278bd",
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: "clothing",
          is_checked: true
        }
      })
    });

    const data = await response.json();

    // Si Replicate devuelve error, lo enviamos al iPhone para leerlo
    if (data.detail) {
      return res.status(422).json({ success: false, error: "Replicate dice: " + data.detail });
    }

    return res.status(200).json({
      success: true,
      predictionId: data.id,
      prendas: [
        { nombre: "Prenda VESTA", precio: "Consultar", imagen: garmImg, link: "#" }
      ]
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Error Servidor: " + error.message });
  }
}
