import Replicate from "replicate";
import catalogo from "../../data/catalogo";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: "Metodo no permitido" });

  try {
    const { imageUrl, estilo } = req.body;

    // Usamos URLs directas de Unsplash para probar si Cloudinary es el problema
    const prendasPorEstilo = {
      urbano: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
      elegante: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    console.log("Iniciando Replicate con:", imageUrl);

    const output = await replicate.run(
      "yisol/idm-vton:91c130948931a7bc55476b70125bc4f686976696d744b486121b66df872e4242",
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
