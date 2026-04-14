export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;

    console.log("Imagen recibida:", imageUrl);

    return res.status(200).json({
      image: imageUrl
    });

  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
}
