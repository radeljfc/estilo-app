export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    let outfitImg = "";
    let prendas = [];
    let nombreEstilo = "";

    if (estilo === "urbano") {
      outfitImg = "https://i.imgur.com/1X6q9KQ.jpg";
      prendas = ["Hoodie negro", "Jeans rotos", "Zapatillas blancas"];
      nombreEstilo = "Urbano Moderno";
    }

    if (estilo === "elegante") {
      outfitImg = "https://i.imgur.com/8Km9tLL.jpg";
      prendas = ["Blazer beige", "Camisa blanca", "Pantalón slim"];
      nombreEstilo = "Elegante Casual";
    }

    res.status(200).json({
      image: imageUrl, // 👈 tu imagen
      outfit: outfitImg, // 👈 outfit referencia
      estilo: nombreEstilo,
      prendas: prendas
    });

  } catch (error) {
    res.status(500).json({ error: "error" });
  }
}
