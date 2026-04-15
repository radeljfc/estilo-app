import catalogo from "../../data/catalogo";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta Token" });

  try {
    const { imageUrl, estilo } = req.body;

    // Imágenes de prendas de ejemplo
    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // LLAMADA AL MODELO CUUUPID (Versión verificada de tus logs)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
            body: JSON.stringify({
        // Usamos la versión exacta que Replicate confirmó en tus logs anteriores
        version: "ac732d54604f39e3b79488cd7a863c374571853a4ae3f8683574163993967a18",
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: "outfit",
          is_checked: true
        }
      })

    });

    const prediction = await response.json();

    // Si hay error en la respuesta de Replicate, lo capturamos aquí
    if (prediction.detail) {
      return res.status(422).json({ success: false, error: prediction.detail });
    }

    return res.status(200).json({
      success: true,
      predictionId: prediction.id,
      estilo: estilo,
      prendas: catalogo[estilo] || []
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
