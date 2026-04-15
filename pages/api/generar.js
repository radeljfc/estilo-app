export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    let outfitImg = "";
    let prendas = [];
    let nombreEstilo = "";

if (estilo === "urbano") {
  outfitImg = "https://pngimg.com/uploads/jacket/jacket_PNG8055.png";
  prendas = [
  {
    nombre: "Chaqueta Urbana",
    precio: "S/ 120",
    link: "https://wa.me/51914680763?text=Quiero%20el%20blazer"
  },
  {
    nombre: "Jeans",
    precio: "S/ 60",
    link: "https://wa.me/51914680763?text=Quiero%20la%20camisa"
  },
  {
    nombre: "Zapatillas",
    precio: "S/ 90",
    link: "https://wa.me/51914680763?text=Quiero%20el%20pantalon"
  }
];
  nombreEstilo = "Urbano Moderno";
}

if (estilo === "elegante") {
  outfitImg = "https://pngimg.com/uploads/suit/suit_PNG93227.png";
  prendas = [
  {
    nombre: "Blazer beige",
    precio: "S/ 120",
    link: "https://wa.me/51914680763?text=Quiero%20el%20blazer"
  },
  {
    nombre: "Camisa blanca",
    precio: "S/ 60",
    link: "https://wa.me/51914680763?text=Quiero%20la%20camisa"
  },
  {
    nombre: "Pantalón slim",
    precio: "S/ 90",
    link: "https://wa.me/51914680763?text=Quiero%20el%20pantalon"
  }
];
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
