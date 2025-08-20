
/**
 * Take CSV string to get df to be easily used in js
 * @param {string} csvString CSV string in JS memory
 * @returns data frame in danfojs
 */
async function dfReadCSVFromString(csvString) {
  // Convert the CSV string to a Blob
  const blob = new Blob([csvString], { type: "text/csv" });

  // Convert Blob to Object URL
  const url = URL.createObjectURL(blob);

  // Use Danfo.js to read CSV from the object URL
  const df = await dfd.readCSV(url);

  // Print or use the DataFrame
  //df.print();

  // Clean up the object URL after use
  URL.revokeObjectURL(url);

  return df;
}

/**
 * For testing when server is not running on local
 * @param {string} url File Location
 * @returns String content of file
 */
async function fetchFileAsString(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`
      );
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

/**
 * Use to download string as a file from js
 * @param {string} text Text content of the file
 * @param {string} filename downloaded file's name
 * @param {string} type type eg json, txt default csv
 */
function downloadCSV(text, filename, type = "csv") {
  const blob = new Blob([text], { type: `text/${type}` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
