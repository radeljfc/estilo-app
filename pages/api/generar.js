import Replicate from "replicate";
import catalogo from "../../data/catalogo";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageUrl, estilo, peso, altura } = req.body;

    // IMPORTANTE: Cambia estas URLs por fotos de PRENDAS SOLAS en tu Cloudinary
    const prendasPorEstilo = {
      urbano: "https://res.cloudinary.com/djk1h8mkc/image/upload/v1/prendas/urbano.jpg",
      elegante: "https://res.cloudinary.com/djk1h8mkc/image/upload/v1/prendas/elegante.jpg"
    };

    const garmImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    const output = await replicate.run(
      "yisol/idm-vton:91c130948931a7bc55476b70125bc4f686976696d744b486121b66df872e4242",
      {
        input: {
          human_img: imageUrl,
          garm_img: garmImg,
          garment_des: `A ${estilo} outfit for a person, ${peso}kg, ${altura}cm`,
          is_checked: true
        }
      }
    );

    // Enviamos 'imageGenerated' para que coincida con el frontend
    res.status(200).json({
      success: true,
      imageGenerated: Array.isArray(output) ? output[0] : output,
      estilo: estilo,
      prendas: catalogo[estilo] || []
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
