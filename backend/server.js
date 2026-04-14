import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ocr", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`,
      {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          requests: [{
            image: { source: { imageUri: imageUrl }},
            features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
          }]
        })
      }
    );

    const data = await response.json();
    res.json({ text: data.responses[0].fullTextAnnotation?.text || "" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);
