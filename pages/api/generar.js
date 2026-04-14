import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "stability-ai/sdxl",
      {
        input: {
          prompt: `A realistic photo of the same person in the image, wearing a modern urban outfit, black hoodie, slim jeans, white sneakers, keep same face, same hairstyle, realistic lighting`,
          image: imageUrl
        }
      }
    );

console.log("OUTPUT COMPLETO:", output);

res.status(200).json({
  image: Array.isArray(output) ? output[0] : output
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error IA" });
  }
}
