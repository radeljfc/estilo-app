import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934e9d507a5f9c8a7e9d3c6f3a3f9b3d5b6a5c6e6f7a8b9c0d1e",
      {
        input: {
          prompt: "a fashionable man wearing a modern urban outfit, realistic photo"
        }
      }
    );

    res.status(200).json({
      image: output[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error IA" });
  }
}
 
