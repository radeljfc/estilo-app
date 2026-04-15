export default async function handler(req, res) {
  const token = process.env.REPLICATE_API_TOKEN;

  try {
    const { imageUrl, estilo } = req.body;
    
    // Ropa según el estilo
    const garmImg = estilo === "elegante" 
      ? "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce" 
      : "https://images.unsplash.com/photo-1520975916090-3105956dac38";

    // LLAMADA DIRECTA POR HTTP (Sin librerías, más robusto)
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
          garment_des: "fashion item",
          is_checked: true
        }
      })
    });

    const prediction = await response.json();

    // Si aquí sale error, es que el Token de Vercel está mal pegado
    if (prediction.detail) {
      return res.status(422).json({ success: false, error: prediction.detail });
    }

    return res.status(200).json({
      success: true,
      predictionId: prediction.id,
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
