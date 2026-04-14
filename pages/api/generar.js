import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // 1. Crear predicción
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-schnell",
      input: {
        prompt: "a fashionable man wearing a modern urban outfit, realistic photo"
      }
    });

    let result = prediction;

    // 2. Polling (esperar resultado)
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1500));

      result = await replicate.predictions.get(prediction.id);

      console.log("STATUS:", result.status);

      if (result.status === "succeeded") {
        return res.status(200).json({
          image: result.output[0]
        });
      }

      if (result.status === "failed") {
        return res.status(500).json({ error: "falló IA" });
      }
    }

    return res.status(500).json({ error: "timeout IA" });

  } catch (error) {
    console.error("ERROR IA:", error);
    return res.status(500).json({ error: "error IA real" });
  }
}
