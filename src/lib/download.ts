// Import types for Solution
import { Solution } from "@/types";
import toast from "react-hot-toast";

// Function to format the solution data for display
const formatSolution = (data: Solution): string => {
  const formattedData: string[] = [];

  // Baris 1: Buffer size
  if (Boolean(data.result.seq && data.result.string)) {
    formattedData.push(`${data.result.score}`);
  }

  // Baris 2: String token
  if (Boolean(data.result.seq && data.result.string)) {
    let formattedString: string = "";

    // Iterate through the string and group every two characters with a space
    for (let i = 0; i < data.result.string.length; i += 2) {
      const twoChars = data.result.string.slice(i, i + 2);
      formattedString += twoChars + " ";
    }
    formattedString = formattedString.trim();
    formattedData.push(formattedString);
  } else {
    // If no answer sequence is present, add a default message
    formattedData.push("No answer sequence to get the prize");
  }

  // Baris 3 dan seterusnya: Koordinat data seq index
  data.result.seq.forEach((seq) => {
    formattedData.push(`${seq}`);
  });

  // Baris terakhir: Hasil dalam milisekon
  formattedData.push(
    `${parseFloat(String(data.runtime * 1000)).toFixed(0)} ms`
  );

  // Join formatted data with newline character and return
  return formattedData.join("\n");
};

// Function to save and download the formatted solution data
const saveAndDownloadSolution = (data: any): void => {
  // Check if there is no result to save and download, show error and return
  if (!data.result) {
    toast.error("No result to save and download");
    return;
  }

  // Format the solution data
  const formattedData = formatSolution(data);

  // Prompt the user to enter a filename, default to "solution" if not provided
  const fileName = prompt(
    "Enter a filename:",
    data.result.string + " solution" || "solution"
  );

  // Check if the user canceled the prompt, return in that case
  if (!fileName) {
    return;
  }

  // Create a Blob with the formatted data and set the MIME type to text/plain
  const blob = new Blob([formattedData], { type: "text/plain" });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${fileName}.txt`; // Use the entered filename with a .txt extension

  // Append the link to the document body, trigger a click, and remove the link
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoke the object URL to free up resources
  URL.revokeObjectURL(url);
};

export { saveAndDownloadSolution };

