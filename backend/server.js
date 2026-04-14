import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { validateImageUrl, validateOCRText, extractNIK } from "./validator.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API KYC RUNNING 🚀");
});

app.post("/ocr", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // 🔐 VALIDASI INPUT
    const urlError = validateImageUrl(imageUrl);
    if (urlError) {
      return res.status(400).json({ error: urlError });
    }

    // 🔍 OCR GOOGLE VISION
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
    const text = data.responses[0].fullTextAnnotation?.text || "";

    // 🔐 VALIDASI OCR
    const textError = validateOCRText(text);
    if (textError) {
      return res.status(400).json({ error: textError });
    }

    // 🔍 AMBIL NIK
    const nik = extractNIK(text);

    if (!nik) {
      return res.status(400).json({
        error: "NIK tidak ditemukan"
      });
    }

    // ✅ RESPONSE FINAL
    res.json({
      success: true,
      nik,
      text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error"
    });
  }
});

// 🔥 WAJIB UNTUK RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
