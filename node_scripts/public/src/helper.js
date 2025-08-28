/**
 * @param {string} url File Location
 * @returns String content of file
 */
export async function fetchFileAsString(url) {
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
export function downloadCSV(text, filename, type = "csv") {
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