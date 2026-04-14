import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: "a fashionable man wearing a modern urban outfit, realistic photo"
        }
      }
    );

    console.log("OUTPUT:", output);

    return res.status(200).json({
      image: output[0]
    });

  } catch (error) {
    console.error("ERROR IA:", error);
    return res.status(500).json({ error: "error IA" });
  }
}
