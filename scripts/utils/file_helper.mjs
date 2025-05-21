import fs from "node:fs";
import { Icons } from "./icons.mjs";

export function writeFileSync(file, content) {
  try {
    fs.writeFileSync(file, content, "utf8");
    console.log(
      `${Icons.success}Successfully wrote initial content to ${file}`
    );
  } catch (error) {
    console.error(`${Icons.error}There was an error writing ${file} - ${error}`);
  }
}

export function readFileSync(file) {
  try {
    const finalContent = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    console.log(`${Icons.success}Successfully read content from file ${file}`);
    return finalContent;
  } catch (error) {
    console.error(`${Icons.error}Error while Reading ${file} - ${error}`);
  }
}

export function appendToJSONFile(file, key, value) {
  try {
    let existingContent = readFileSync(file);
    if (
      existingContent === undefined ||
      existingContent.trim() === "" ||
      existingContent === null
    ) {
      existingContent = "{}";
    }
    let existingContentJson = JSON.parse(existingContent);
    existingContentJson[key] = value;
    writeFileSync(file, JSON.stringify(existingContentJson));
    console.log(`${Icons.success}Key value pair added to ${file}`);
  } catch (error) {
    console.error(
      `${Icons.error}There was a error writing to ${file} - ${error}, 
      please note the key and value add it to the file manually.-->`
    );
    console.log(`${Icons.star} ${key} : ${value}`);
  }
}

export async function appendFile(file, content) {
  try {
    // Write initial content to the file
    await fs.appendFile(file, content, "utf8");
    console.log(
      `${Icons.success}Successfully wrote initial content to ${file}`
    );
  } catch (error) {
    console.error(`${Icons.error}There was an error writing file - ${error}`);
  }
}
