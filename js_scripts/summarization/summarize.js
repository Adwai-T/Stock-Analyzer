const { queryLocalLLM } = require("./lmstudio_helper");
const { parsePdf, splitTextIntoChunks } = require("./pdf_parse");
const { writeFile } = require("./file_helper");

// --- --- --- Contants --- --- --- //
const summarizeInitText =
  "Could you please summarize the given text in 50 words or less? If there is financial data, please in a new line/section give its importance, if they are ratios that can be formed please do that. The financial status does not have any word limit. Summarize Text -\n.";

// --- Functions --- //
async function main() {
  const pdfText = await parsePdf("files/sbireport.pdf");
  let splitTextArray = splitTextIntoChunks(pdfText, 800);
  console.log(splitTextArray.length);

  let fullSummary = "";
  for (let i = 0; i < 2; i++) {
    console.log(
      "Requested Chunk - " + i + " out of " + splitTextArray.length
    );
    let summary = await queryLocalLLM(summarizeInitText + splitTextArray[i]);
    fullSummary += " \n" + summary;
  }

  await writeFile("sbisummary.txt", fullSummary);
}

main();