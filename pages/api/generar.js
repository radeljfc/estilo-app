import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    let prompt = "";

    if (estilo === "urbano") {
      prompt = "a man wearing urban streetwear, hoodie, sneakers, keep same face, realistic photo";
    }

    if (estilo === "elegante") {
      prompt = "a man wearing elegant casual outfit, blazer, clean style, keep same face, realistic photo";
    }

    const output = await replicate.run(
      "stability-ai/sdxl:latest",
      {
        input: {
          prompt: prompt,
          image: imageUrl,
          strength: 0.7
        }
      }
    );

    res.status(200).json({
      image: output?.[0] || null,
      estilo: estilo,
      prendas: ["Outfit generado con IA"]
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
