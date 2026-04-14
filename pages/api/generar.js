export default async function handler(req, res) {
  try {
    const { image } = req.body;

    console.log("imagen recibida:", image ? "sí" : "no");

    return res.status(200).json({
      image: "https://picsum.photos/300/400?random=" + Math.random()
    });

  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
}
