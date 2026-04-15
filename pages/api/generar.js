import catalogo from "../../data/catalogo";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta Token" });

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // 1. Iniciamos la predicción
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c871bb9b0e06041a4629961da79f5796f043d3c26b3add9034a78ebda517f093",
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: `outfit ${estilo}`,
          is_checked: true
        }
      })
    });

    const prediction = await response.json();

    // 2. Respondemos de inmediato con el ID para que Vercel no se cuelgue
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
