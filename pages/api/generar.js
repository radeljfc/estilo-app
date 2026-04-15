import { catalogo } from "../../data/catalogo";
prendas = catalogo[estilo] || [];
export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    let outfitImg = "";
    let prendas = [];
    let nombreEstilo = "";



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
