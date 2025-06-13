const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePdf(fileLocation) {
  try{
    const pdfBuffer = fs.readFileSync(fileLocation);
    const parsed = await pdf(pdfBuffer);
    const text = parsed.text;
    return text;
  }
  catch(error) {
    console.error("Failed to read PDF:", error);
  }
}

function splitTextIntoChunks(text, size) {
  const words = text.split(/\s+/); // Split the text into an array of words
  const chunks = [];
  const chunkSize = size ? size : 100;

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
  }

  return chunks;
}

module.exports = { parsePdf, splitTextIntoChunks };