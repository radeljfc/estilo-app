import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 🎯 PROMPT DINÁMICO SEGÚN ESTILO
    let prompt = "";

    if (estilo === "urbano") {
      prompt = "a man wearing modern urban streetwear, hoodie, sneakers, realistic photo";
    }

    if (estilo === "elegante") {
      prompt = "a man wearing elegant casual outfit, blazer, clean style, realistic photo";
    }

    // 🔥 USAMOS LA IMAGEN DEL USUARIO
    const output = await replicate.run(
      "stability-ai/sdxl",
      {
        input: {
          prompt: prompt,
          image: imageUrl // 👈 clave
        }
      }
    );

    // 👕 SIMULACIÓN DE PRENDAS
    let prendas = [];

    if (estilo === "urbano") {
      prendas = ["Hoodie negro", "Jeans rotos", "Zapatillas blancas"];
    }

    if (estilo === "elegante") {
      prendas = ["Blazer beige", "Camisa blanca", "Pantalón slim"];
    }

    res.status(200).json({
      image: output[0],
      estilo: estilo,
      prendas: prendas
    });

  } catch (error) {
    console.error("ERROR IA:", error);
    res.status(500).json({ error: "error IA" });
  }
}
