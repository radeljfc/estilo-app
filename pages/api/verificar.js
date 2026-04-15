export default async function handler(req, res) {
  const token = process.env.REPLICATE_API_TOKEN;

  // 1. Verificamos si el token existe
  if (!token) {
    return res.status(200).json({ 
      error: "EL TOKEN NO EXISTE EN VERCEL. Revisa las variables de entorno." 
    });
  }

  // 2. Verificamos si el token tiene el formato correcto (empieza por r8_)
  if (!token.trim().startsWith("r8_")) {
    return res.status(200).json({ 
      error: "EL TOKEN TIENE UN FORMATO INVÁLIDO. Debe empezar por r8_." 
    });
  }

  // 3. Intentamos una llamada mínima a Replicate para ver si nos rechaza
  try {
    const response = await fetch("https://api.replicate.com/v1/models/cuuupid/idm-vton", {
      headers: { "Authorization": `Token ${token.trim()}` }
    });
    
    if (response.status === 401) {
      return res.status(200).json({ error: "TOKEN NO AUTORIZADO. El token es incorrecto o expiró." });
    }

    return res.status(200).json({ 
      success: true, 
      mensaje: "¡TOKEN CONECTADO CORRECTAMENTE!",
      status_replicate: response.status
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
