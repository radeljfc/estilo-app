import Replicate from "replicate";
import catalogo from "../../data/catalogo";

// Inicializamos la IA con tu Token (debe estar en las variables de entorno de Vercel)
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Solo POST" });

  try {
    const { imageUrl, estilo, peso, altura } = req.body;

    // Referencia de prendas según el catálogo (puedes añadir más aquí)
    const prendasPorEstilo = {
      urbano: "https://res.cloudinary.com/djk1h8mkc/image/upload/v1/prendas/camisa_urbana.jpg",
      elegante: "https://res.cloudinary.com/djk1h8mkc/image/upload/v1/prendas/blazer_beige.jpg"
    };

    const garmentImg = prendasPorEstilo[estilo] || prendasPorEstilo["urbano"];

    // Llamada al modelo de IA IDM-VTON (especializado en probador virtual)
    const output = await replicate.run(
      "yisol/idm-vton:91c130948931a7bc55476b70125bc4f686976696d744b486121b66df872e4242",
      {
        input: {
          human_img: imageUrl,      // Foto del usuario
          garm_img: garmentImg,     // Foto de la prenda sola
          garment_des: `A ${estilo} style outfit for a person weighing ${peso}kg and ${altura}cm height`,
          is_checked: true
        }
      }
    );

    // El resultado de la IA suele ser un array, tomamos la primera imagen
    const resultadoIA = Array.isArray(output) ? output[0] : output;

    res.status(200).json({
      success: true,
      imageGenerated: resultadoIA,
      prendas: catalogo[estilo] || []
    });

  } catch (error) {
    console.error("Error en Replicate:", error);
    res.status(500).json({ error: "Fallo al generar la imagen con IA" });
  }
}
