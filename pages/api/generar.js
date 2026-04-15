import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 👕 IMÁGENES DE ROPA SEGÚN ESTILO
    let cloth = "";

    if (estilo === "urbano") {
      cloth = "https://i.imgur.com/3QbZ4sG.png"; // hoodie ejemplo
    }

    if (estilo === "elegante") {
      cloth = "https://i.imgur.com/0nQGJ3B.png"; // blazer ejemplo
    }

    // 🔥 MODELO TRY-ON REAL
    const output = await replicate.run(
      "cuuupid/idm-vton",
      {
        input: {
          human_img: imageUrl,
          garm_img: cloth
        }
      }
    );

    res.status(200).json({
      image: output,
      estilo: estilo,
      prendas: ["Outfit aplicado con IA"]
    });

  } catch (error) {
    console.error("ERROR IA:", error);

    res.status(200).json({
      image: null,
      estilo: estilo,
      prendas: []
    });
  }
}
