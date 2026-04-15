export default async function handler(req, res) {
  const { id } = req.query;
  const token = process.env.REPLICATE_API_TOKEN;

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { "Authorization": `Token ${token.trim()}` }
    });
    const result = await response.json();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
