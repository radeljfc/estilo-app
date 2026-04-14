import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "stability-ai/sdxl",
      {
        input: {
          prompt: "a man wearing modern urban outfit, realistic face, same person"
        }
      }
    );

    res.status(200).json({
      image: output[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error generando imagen" });
  }
}
