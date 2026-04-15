import catalogo from "../../data/catalogo";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  const VERSION_ID = "0513734a81fd5382025816922cf90082f4d38c62c3e41df473950b7308d278bd";

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: VERSION_ID,
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: "clothing",
          is_checked: true
        }
      })
    });

    const prediction = await response.json();

    // Si Replicate responde con error de versión, aquí lo atrapamos
    if (prediction.detail && prediction.detail.includes("version")) {
      return res.status(422).json({ 
        success: false, 
        error: "REPLICATE_VERSION_ERROR: La versión enviada fue " + VERSION_ID 
      });
    }

    if (prediction.error) {
       return res.status(500).json({ success: false, error: prediction.error });
    }

    return res.status(200).json({
      success: true,
      predictionId: prediction.id,
      estilo: estilo,
      prendas: catalogo[estilo] || []
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Error de servidor: " + error.message });
  }
}
