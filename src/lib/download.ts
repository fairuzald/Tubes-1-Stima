import { Solution } from "@/types";
import toast from "react-hot-toast";

const formatSolution = (data: Solution): string => {
  const formattedData: string[] = [];

  // Baris 1: Buffer size
  formattedData.push(`${data.result.score}`);

  // Baris 2: String token
  let formattedString: string = "";

  for (let i = 0; i < data.result.string.length; i += 2) {
    const twoChars = data.result.string.slice(i, i + 2);
    formattedString += twoChars + " ";
  }
  formattedString = formattedString.trim();
  formattedData.push(formattedString);

  // Baris 3 dan seterusnya: Koordinat data seq index
  data.result.seq.forEach((seq) => {
    formattedData.push(`${seq}`);
  });

  // Baris terakhir: Hasil dalam milisekon
  formattedData.push(
    `${parseFloat(String(data.runtime * 1000)).toFixed(0)} ms`
  );

  return formattedData.join("\n");
};

const saveAndDownloadSolution = (data: any): void => {
  if (!data.result) {
    toast.error("No result to save and download");
    return;
  }
  
  const formattedData = formatSolution(data);
  const fileName = prompt('Enter a filename:', data.result.string + " solution" || "solution");

  if (!fileName) {
    // Handle case when the user cancels the prompt
    return;
  }

  const blob = new Blob([formattedData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${fileName}.txt`; // Use the entered filename with a .txt extension
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export { saveAndDownloadSolution };

