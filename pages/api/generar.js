import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.create({
      version: "stability-ai/sdxl",
      input: {
        prompt: "a man wearing modern urban outfit, realistic",
        image: imageUrl
      }
    });

    res.status(200).json({
      image: prediction.output ? prediction.output[0] : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error IA" });
  }
}
