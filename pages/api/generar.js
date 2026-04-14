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
          prompt: "a fashionable man wearing a modern urban outfit, realistic photo"
        }
      }
    );

    console.log("OUTPUT:", output);

    const image = Array.isArray(output) ? output[0] : null;

    return res.status(200).json({
      image
    });

  } catch (error) {
    console.error("ERROR IA:", error);
    return res.status(500).json({ error: "error IA" });
  }
}
