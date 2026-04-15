import catalogo from "../../data/catalogo";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  
  if (!token) {
    return res.status(500).json({ success: false, error: "Token no configurado en Vercel" });
  }

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // Llamada directa vía HTTP para evitar errores de la librería
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Esta es la versión exacta que te funcionó en la web
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

    if (prediction.error) {
      return res.status(500).json({ success: false, error: prediction.detail || prediction.error });
    }

    // Como Replicate tarda unos segundos, vamos a esperar el resultado
    // Para el MVP, devolveremos la URL de la predicción
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
      const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { "Authorization": `Token ${token.trim()}` }
      });
      result = await checkResponse.json();
    }

    if (result.status === "succeeded") {
      return res.status(200).json({
        success: true,
        imageGenerated: result.output[0],
        estilo: estilo,
        prendas: catalogo[estilo] || []
      });
    } else {
      return res.status(500).json({ success: false, error: "La IA falló al procesar" });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
