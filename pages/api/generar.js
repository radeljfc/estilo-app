export default async function handler(req, res) {
  return res.status(200).json({
    image: "https://picsum.photos/300/400?random=" + Math.random()
  });
}
