export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;

    console.log("Imagen recibida:", imageUrl);

    return res.status(200).json({
  image: imageUrl,
  estilo: "Urban Street",
  prendas: [
    "Hoodie negro oversized",
    "Jeans slim fit",
    "Zapatillas blancas",
    "Cadena plateada"
  ]
});

  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
}
