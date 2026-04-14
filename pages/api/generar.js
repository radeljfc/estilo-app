export default async function handler(req, res) {
  try {
    const { imageUrl, estilo } = req.body;

    const estilos = {
      urbano: {
        nombre: "Urban Street",
        prendas: [
          "Hoodie negro oversized",
          "Jeans slim fit",
          "Zapatillas blancas",
          "Cadena plateada"
        ]
      },
      elegante: {
        nombre: "Elegante Casual",
        prendas: [
          "Camisa blanca",
          "Pantalón de vestir",
          "Zapatos negros",
          "Reloj clásico"
        ]
      }
    };

    const seleccionado = estilos[estilo] || estilos["urbano"];

    return res.status(200).json({
      image: imageUrl,
      estilo: seleccionado.nombre,
      prendas: seleccionado.prendas
    });

  } catch (error) {
    return res.status(500).json({ error: "error" });
  }
}
