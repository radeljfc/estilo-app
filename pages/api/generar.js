export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false });

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return res.status(500).json({ error: "Falta el TOKEN en Vercel" });

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // LLAMADA CON LA VERSIÓN EXACTA DE LA DOCUMENTACIÓN
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Esta es la versión que acabas de encontrar:
        version: "0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: estilo === "urbano" ? "urban street style top" : "elegant casual top",
          is_checked: true,
          is_checked_det_lib: false,
          mask_target: "upper_body"
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
      prendas: [{ nombre: "Look VESTA", precio: "Original", imagen: garmImg, link: "#" }]
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Error: " + error.message });
  }
}
