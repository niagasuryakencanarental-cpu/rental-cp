export function validateImageUrl(url) {
  if (!url) return "imageUrl wajib diisi";
  if (!url.startsWith("http")) return "URL tidak valid";
  return null;
}

export function validateOCRText(text) {
  if (!text || text.length < 10) {
    return "Teks tidak terbaca / terlalu pendek";
  }
  return null;
}

export function extractNIK(text) {
  const nik = text.match(/\d{16}/)?.[0];
  return nik || null;
}
