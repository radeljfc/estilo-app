export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    let outfitImg = "";
    let prendas = [];
    let nombreEstilo = "";

if (estilo === "urbano") {
  outfitImg = "https://pngimg.com/uploads/jacket/jacket_PNG8055.png";
  prendas = ["Chaqueta urbana", "Jeans", "Zapatillas"];
  nombreEstilo = "Urbano Moderno";
}

if (estilo === "elegante") {
  outfitImg = "https://pngimg.com/uploads/suit/suit_PNG93227.png";
  prendas = ["Blazer", "Camisa", "Pantalón"];
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
