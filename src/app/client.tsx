"use client";
import { ChangeEvent, useState } from "react";

interface Matrix {
  [key: number]: string[];
}

interface Target {
  sequence: string[];
  points: number;
}

interface ParsedFile {
  buffer: number;
  rowCount: number;
  colCount: number;
  parsedMatrix: Matrix;
  parsedTargets: Target[];
}

export default function Client() {
  const [file, setFile] = useState<File | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [buffer, setBuffer] = useState<number>(0);

  console.log("targets", targets, "matrix", matrix, "buffer", buffer);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileContent = await readFileContent(selectedFile);
      console.log("fileContent", fileContent);
      const { buffer, rowCount, colCount, parsedTargets, parsedMatrix } =
        parseFileContent(fileContent);

      setBuffer(buffer);
      setTargets(parsedTargets);
      setMatrix(parsedMatrix);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Error reading file."));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const parseFileContent = (content: string): ParsedFile => {
    const lines = content.split("\n");
    const parsedTargets: Target[] = [];
    const parsedMatrix: Matrix = {};
    let matrixRowIndex = 0;
    let rowCount = 0;
    let colCount = 0;
    let buffer = 0;
    let numberOfTargets = 0; // Declare numberOfTargets here

    // Parse the content line by line
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (index === 0) {
        // Parse buffer size
        buffer = parseInt(trimmedLine, 10);
      } else if (index === 1) {
        // Parse row and column count
        const [rows, cols] = trimmedLine
          .split(" ")
          .map((value) => parseInt(value, 10));
        rowCount = rows;
        colCount = cols;
      } else if (index >= 2 && index < 2 + rowCount) {
        // Parse matrix values
        const values = trimmedLine.split(" ");
        const matrixRow = values.map((value) => value);
        parsedMatrix[matrixRowIndex++] = matrixRow;
      } else if (index === 2 + rowCount) {
        // Parse the number of targets
        numberOfTargets = parseInt(trimmedLine, 10);
      } else if (
        index > 2 + rowCount &&
        index <= 2 + rowCount + numberOfTargets * 2
      ) {
        // Parse target values (sequence and points)
        if (index % 2 === 1) {
          // Odd index: sequence
          const sequence = trimmedLine.split(" ").join("");
          const pointsIndex = index + 1;
          const points = parseInt(lines[pointsIndex], 10);
          parsedTargets.push({ sequence: sequence.split(""), points });
        }
      }
    });

    return { buffer, rowCount, colCount, parsedTargets, parsedMatrix };
  };
  const handleClick = async () => {
    try {
      const requestBody = {
        matrix: Object.values(matrix),
        targets: targets,
        buffer: buffer,
        rowCount: 6,
        colCount: 6,
      };
  
      const res = await fetch("http://localhost:3000/api/breach_protocol_solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log("Result:", data.result);
      } else {
        console.error("Error:", res.status);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  return (
    <>
      <input type="file" accept=".txt" onChange={handleFileChange} />{" "}
      <button
        className="bg-light-green w-fit text-black font-bold text-xl p-8"
        onClick={handleClick}
      >
        Submit
      </button>
      {/* Render other components based on the parsed data */}
    </>
  );
}
