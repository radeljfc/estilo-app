export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    // 👕 estilos simulados
    let prendas = [];
    let nombreEstilo = "";

    if (estilo === "urbano") {
      nombreEstilo = "Urbano Moderno";
      prendas = ["Hoodie negro", "Jeans rotos", "Zapatillas blancas"];
    }

    if (estilo === "elegante") {
      nombreEstilo = "Elegante Casual";
      prendas = ["Blazer beige", "Camisa blanca", "Pantalón slim"];
    }

    // 🔥 devolvemos la MISMA imagen (estable)
    res.status(200).json({
      image: imageUrl,
      estilo: nombreEstilo,
      prendas: prendas
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: "error backend" });
  }
}
