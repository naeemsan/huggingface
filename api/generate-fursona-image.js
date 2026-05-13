export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    const prompt = [
      "high quality furry fursona character concept art",
      species: ${body.species || "wolf"},
      style: ${body.style || "semi realistic furry art"},
      color palette: ${body.colorMood || "balanced colors"},
      personality: ${body.personality || "friendly expressive"},
      "full body furry character",
      "professional furry fandom artwork",
      "clean lighting",
      "detailed fur",
      "centered composition",
      "no watermark",
      "no text",
    ].join(", ");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Lykon/dreamshaper-8",
      {
        method: "POST",
        headers: {
          Authorization: Bearer ${process.env.HF_TOKEN},
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: "Hugging Face image generation failed.",
        details: errorText,
      });
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(imageBuffer);
  } catch (error) {
    return res.status(500).json({
      error: "Image generation failed.",
    });
  }
}
