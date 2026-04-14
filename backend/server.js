import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

// route OCR
app.post("/ocr", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: { imageUri: imageUrl }
              },
              features: [
                { type: "DOCUMENT_TEXT_DETECTION" }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const text =
      data.responses[0].fullTextAnnotation?.text || "";

    res.json({ text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 🔥 PORT FIX UNTUK RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
