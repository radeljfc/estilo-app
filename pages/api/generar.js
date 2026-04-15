import Replicate from "replicate";
import catalogo from "../../data/catalogo";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: "Metodo no permitido" });

  try {
    const { imageUrl, estilo } = req.body;

    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // NUEVA VERSIÓN ACTUALIZADA (IDM-VTON)
    const output = await replicate.run(
      "yisol/idm-vton:c871bb9b0e06041a4629961da79f5796f043d3c26b3add9034a78ebda517f093",
      {
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: `outfit ${estilo}`,
          is_checked: true
        }
      }
    );

    const resultadoIA = Array.isArray(output) ? output[0] : output;

    return res.status(200).json({
      success: true,
      imageGenerated: resultadoIA,
      estilo: estilo,
      prendas: catalogo[estilo] || []
    });

  } catch (error) {
    console.error("DETALLE ERROR:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
