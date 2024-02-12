"use client";
import { saveAndDownloadSolution } from "@/lib/download";
import { makeApiRequest } from "@/lib/helper";
import { getColumnCount, getRowCount } from "@/lib/utils";
import type { Matrix, ParsedFile, Target } from "@/types";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [buffer, setBuffer] = useState<number>(0);
  const [data, setData] = useState<any>({});

  // handle file change upload
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // Reset the state
    setBuffer(0);
    setTargets([]);
    setMatrix({});
    setData({});
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const fileContent = await readFileContent(selectedFile);
      const { buffer, parsedTargets, parsedMatrix } =
        parseFileContent(fileContent);

      setBuffer(buffer);
      setTargets(parsedTargets);
      setMatrix(parsedMatrix);
    }
  };

  // parse file content
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
    let parsedMatrix: Matrix = {};
    let matrixRowIndex = 0;
    let rowCount = 0;
    let colCount = 0;
    let buffer = 0;
    let numberOfTargets = 0;
    let errorToastShown = false;

    // Parse the content line by line
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (index === 0) {
        // Parse buffer size 1st line
        buffer = parseInt(trimmedLine, 10);
      }
      // Parse row and column count 2nd line
      else if (index === 1) {
        const [cols, rows] = trimmedLine.split(" ").map((value) => parseInt(value, 10));
        if(isNaN(cols) || isNaN(rows) || cols < 2 || rows < 2){
          toast.error("Invalid matrix size. The number of columns and rows must match the specified width at least 2.");
          errorToastShown = true;
          resetVariables();
          return;
        }
        rowCount = rows;
        colCount = cols;
      }
      // Parse matrix values
      else if (index >= 2 && index < 2 + rowCount) {
        const values = trimmedLine.split(" ");

        // Validate row and column count matrix section line
        if (values.length !== colCount && !errorToastShown) {
          toast.error("Invalid matrix width.");
          errorToastShown = true;
          resetVariables();
          return;
        }

        // Validate each matrix cell (token) to have exactly 2 characters
        if (values.some((value) => value.length !== 2) && !errorToastShown) {
          toast.error("Invalid matrix tokens format. Each tokens must have exactly 2 characters.");
          errorToastShown = true;
          resetVariables();
          return;
        }

        const matrixRow = values.map((value) => value);
        parsedMatrix[matrixRowIndex++] = matrixRow;
      }
      // Parse the number of targets
      else if (index === 2 + rowCount) {
        if (trimmedLine.split(" ").length !== 1 && !errorToastShown) {
          toast.error("Invalid height matrix format. The number of targets must be a single integer.");
          errorToastShown = true;
          resetVariables();
          return;
        }

        numberOfTargets = parseInt(trimmedLine, 10);
      }
      // Parse and validate target values
      else if (index > 2 + rowCount && index <= 2 + rowCount + numberOfTargets * 2) {
        if (index % 2 === 0 && rowCount % 2 === 1 || (index % 2 === 1 && rowCount % 2 === 0)) {
          // Parse target values (sequence and points)
          const sequenceArray = trimmedLine.split(" ");
          if (sequenceArray.length <= 1) {
            toast.error("Invalid target sequence format. Each sequence must have at least 2 tokens.");
            resetVariables();
            return;
          }

          const isValid = validateSequenceFormat(sequenceArray);

          if (isValid) {
            const sequence = sequenceArray.join("");
            const pointsIndex = index + 1;
            const points = parseInt(lines[pointsIndex], 10);
            parsedTargets.push({ sequence: sequence.split(""), points });
          } else {
            resetVariables();
          }
        }
      }
    });

    return { buffer, parsedTargets, parsedMatrix };

    // Helper function to reset variables
    function resetVariables() {
      buffer = 0;
      rowCount = 0;
      colCount = 0;
      parsedTargets.length = 0;
      parsedMatrix = {};
    }

    // Helper function to validate sequence format
    function validateSequenceFormat(sequenceArray: string[]): boolean {
      let isValid = true;

      sequenceArray.forEach((value) => {
        if (value.length !== 2 && !errorToastShown) {
          toast.error("Invalid price sequence format. Each tokens must have exactly 2 characters.");
          errorToastShown = true;
          isValid = false;
        }
      });

      return isValid;
    }
  };

  const handleClick = async () => {
    if (Object.keys(matrix).length < 1 || targets.length < 1) {
      toast.error("Matrix or targets must be initialized first");
      return;
    }
    if (buffer < 1) {
      toast.error("Buffer must be initialized first");
      return;
    }
    if (getRowCount(matrix) < 1 || getColumnCount(matrix) < 1) {
      toast.error("Matrix must be initialized first");
      return;
    }
    try {
      const requestBody = {
        matrix: Object.values(matrix),
        targets: targets,
        buffer: buffer,
        rowCount: getRowCount(matrix),
        colCount: getColumnCount(matrix),
      };
      makeApiRequest({
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        loadingMessage: "Loading....",
        successMessage: "Successful!",
        endpoint: "/api/breach_protocol_solve",
        onSuccess: (data) => {
          setData(data);
        },
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <main className="flex min-h-screen font-mono flex-col px-8 py-8 md:px-20 lg:py-10 xl:px-32 xl:py-14 2xl:py-20 gap-4">
      {/* title */}
      <h1 className="text-3xl lg:text-4xl 2xl:text-5xl text-light-green border-b-2 border-b-green w-fit">
        CyberPunk 2077 Hacking Mini Game Solver
      </h1>
      {/* Navigation to other input */}
      <div className="flex flex-col gap-3 text-white">
        <h2 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl">Select Other Input Methods:</h2>
        <div className="text-white p-2 rounded-md flex gap-5">
          <Link className="text-base lg:text-xl bg-green py-2 px-3 lg:py-3 lg:px-4 rounded-lg" href="/randomize">
            <p>Randomize</p>
          </Link>
          <Link className="text-base lg:text-xl bg-green py-2 px-3 lg:py-3 lg:px-4 rounded-lg" href="/">
            <p>File Input</p>
          </Link>

        </div>
        <div className="flex flex-col gap-3">
          {/* Label */}
          <label htmlFor="file-input" className="text-green text-xl lg:text-xl xl:text-2xl">Insert the txt file</label>
          {/* File Input */}
          <input id="file-input" type="file" accept=".txt" onChange={handleFileChange} />
          {/* Matrix Table */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-14 2xl:gap-20">
              <div
                className="w-fit h-fit items-center justify-center mt-4"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${getColumnCount(matrix)}, 1fr)`,
                }}
              >
                {Object.values(matrix).map((row, rowIndex) =>
                  row.map((cell: number, colIndex: number) => {
                    const isMatched = data.result?.seq?.some(
                      (coord: number[]) =>
                        coord[0] - 1 === colIndex && coord[1] - 1 === rowIndex
                    );

                    return (
                      <p
                        style={{
                          border: isMatched ? "2px solid red" : "2px solid white",
                        }}
                        className="w-9  lg:w-10 xl:w-12 2xl:w-14 aspect-square m-auto text-base lg:text-lg xl:text-xl 2xl:text-2xl text-center"
                        key={`cell-${rowIndex}-${colIndex}`}
                      >
                        {cell}
                      </p>
                    );
                  })
                )}
              </div>
              <div>
                {/* Enumerate step */}
                {Boolean(data.result?.seq?.length > 0 && data.result?.string) ? (
                  <div className=" text-white">
                    <ol className="flex flex-col mt-4">
                      <p className="text-green">How the step to get the optimal answer?</p>
                      {data.result?.seq.map((arr: number[], i: number) => (
                        <li key={i}>
                          Step {i + 1}: {i === 0 ? "Start on " : "Move to "}({arr[0]}, {arr[1]})
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  Boolean(data.result?.string == "") && <p>No answer sequence to get the prize</p>
                )}
                {/* Points */}
                {
                  Boolean(data.result?.string) &&
                  <p className="text-green">Points: {data.result?.score}</p>

                }
                {/* Runtime */}
                {
                  Boolean(data?.result) &&
                  <p className="text-green">Runtime: {parseFloat(String(data.runtime * 1000)).toFixed(1)} ms</p>
                }
              </div>
            </div>
            <div className="flex flex-col">
              {/* Buffer */}
              {buffer > 0 && <p className="text-green">Buffer Size: {buffer}</p>}
              {/* Target */}
              {targets.map((target, index) => (
                <p key={index} className="text-white">
                  Target {index + 1}: {target.sequence.join("").match(/.{1,2}/g)?.join(" ")} - {target.points} {target.points > 1 || target.points < 1 ? "points" : "point"}
                </p>
              ))}
            </div>
          </div>
          {/* Button */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {matrix &&
              <button
                className="bg-light-green w-fit text-black font-bold text-base lg:text-xl py-2 px-3 lg:py-3 lg:px-4 rounded-xl disabled:cursor-not-allowed"
                onClick={handleClick}
                disabled={Object.keys(matrix).length < 1 || targets.length < 1}
              >
                Submit
              </button>
            }
            {Boolean(data.result) && (
              <button
                className="w-fit bg-green py-2 px-3 lg:py-3 lg:px-4 text-base lg:text-xl rounded-xl"
                onClick={() => saveAndDownloadSolution(data)}
              >
                Simpan solusi dan Download
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
