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
    // UBICACIÓN: pages/api/generar.js

const output = await replicate.run(
  "cuuupid/idm-vton:906921333a9293a3ef947a46fa337c6802613b361191e4f358f00078028d7037",
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
