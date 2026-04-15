import catalogo from "../../data/catalogo";

export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    console.log("ESTILO:", estilo);

    let outfitImg = null;

    if (estilo === "urbano") {
      outfitImg = "https://images.unsplash.com/photo-1520975916090-3105956dac38";
    } else if (estilo === "elegante") {
      outfitImg = "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce";
    }

    const prendas = catalogo[estilo] || [];

    res.status(200).json({
      image: imageUrl,
      outfit: outfitImg,
      estilo: estilo,
      prendas: prendas
    });

  } catch (error) {
    console.error("ERROR API:", error);
    res.status(500).json({ error: "error" });
  }
}
