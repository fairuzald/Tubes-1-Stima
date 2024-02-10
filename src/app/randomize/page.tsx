"use client";
import { makeApiRequest } from "@/lib/helper";
import Link from "next/link";
import { useState } from "react";

interface Matrix {
  [key: number]: string[];
}

type Solution = {
  result: {
    seq: Array<Array<number>>;
    string: string;
    score: number;
  };
  runtime: number;
};

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
const getRowCount = (matrix: Matrix): number => {
  return Object.keys(matrix).length;
};

const getColumnCount = (matrix: Matrix): number => {
  if (getRowCount(matrix) === 0) {
    // Handle empty matrix case
    return 0;
  }

  // Ambil panjang array pada salah satu baris, karena semua baris dianggap memiliki jumlah kolom yang sama
  const firstRowKey = parseInt(Object.keys(matrix)[0]);
  return matrix[firstRowKey].length;
};
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [buffer, setBuffer] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [col, setCol] = useState<number>(0);
  const [row, setRow] = useState<number>(0);

  console.log(
    "targets",
    targets,
    "matrix",
    matrix,
    "buffer",
    buffer,
    "data",
    data
  );
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

  const saveAndDownloadSolution = (): void => {
    const formattedData = formatSolution(data);

    const blob = new Blob([formattedData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solution.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const randomizeMatrix = (rowCount: number, colCount: number): Matrix => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const matrix: Matrix = {};

    for (let i = 0; i < rowCount; i++) {
      const row: string[] = [];
      for (let j = 0; j < colCount; j++) {
        const randomCharIndex1 = Math.floor(Math.random() * characters.length);
        const randomCharIndex2 = Math.floor(Math.random() * characters.length);
        const randomChar1 = characters.charAt(randomCharIndex1);
        const randomChar2 = characters.charAt(randomCharIndex2);
        row.push(randomChar1 + randomChar2);
      }
      matrix[i] = row;
    }
    
    return matrix;
  };

  const randomizeTarget = (matrix: Matrix, count: number): Target[] => {
    let randomTargets: Target[] = [];

    for (let i = 0; i < count; i++) {
      let random = []
      const randomCountSeq = Math.floor(Math.random() * 6) + 1;
      for (let j = 0; j < randomCountSeq; j++) {

        const randomRowIndex = Math.floor(
          Math.random() * Object.keys(matrix).length
        );
        const randomColIndex = Math.floor(
          Math.random() * matrix[randomRowIndex].length
        );
        random.push(matrix[randomRowIndex][randomColIndex]);

      }
      const randomTarget: Target = {
        sequence: random,
        points: Math.floor(Math.random() * 100),
      };
      randomTargets.push(randomTarget);
    }

    return randomTargets;
  };

  const handleClick = async () => {
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
    <main className="flex min-h-screen font-mono flex-col p-24">
      <h1 className="text-4xl text-light-green border-b-2 border-b-green w-fit">
        CyberPunk 2077 Mini Game Solver
      </h1>
      <div className="flex flex-col gap-3 text-white">
        <h2>Pilih Metode Input:</h2>
        <div className="bg-green text-white p-2 rounded-md flex">
          <Link href="/manual-input">
            <p>Manual</p>
          </Link>
          <Link href="/">
            <p>File Input</p>
          </Link>
          <Link href="/input">
            <p>File Upload</p>
          </Link>
        </div>
        <div className="flex flex-col">
          <>
            <div className="flex gap-6 text-black">
              <div className="flex flex-col">
                <p className="text-white text-xl">Masukkan ukuran kolom matrix</p>
                <input type="number"  value={col} onChange={(e)=>setCol(parseInt(e.target.value))}/>
              </div>
              <div className="flex flex-col">
                <p className="text-white text-xl">Masukkan ukuran baris matrix</p>
                <input type="number"  value={row} onChange={(e)=>setRow(parseInt(e.target.value))}/>

              </div>
            </div>
            <div className="flex gap-4">

              <button
                className="bg-light-green w-fit text-black font-bold text-xl p-8"
                onClick={() => { setMatrix(randomizeMatrix(row, col)) }}
              >
                Randomize Matrix
              </button>
              <button
                className="bg-light-green w-fit text-black font-bold text-xl p-8"
                onClick={() => setTargets(randomizeTarget(matrix, 5))}
              >
                Randomize Target
              </button>
            </div>

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
                      className="w-14 aspect-square m-auto text-2xl text-center"
                      key={`cell-${rowIndex}-${colIndex}`}
                    >
                      {cell}
                    </p>
                  );
                })
              )}
            </div>
            <div className="flex flex-col text-white">
              {targets.map((target, i) => (
                <p key={target.points}>{target.points}</p>
              ))}
            </div>
            <button
              className="bg-light-green w-fit text-black font-bold text-xl p-8"
              onClick={handleClick}
            >
              Submit
            </button>
            <ol className="flex flex-col text-white">
              {data.result?.seq?.map((arr: Array<number>, i: number) => (
                <p key={i}>
                  Step {i + 1}: {i == 0 ? "Start on " : "Move to "}({arr[0]},
                  {arr[1]})
                </p>
              ))}
            </ol>
            <p>Points: {data.result?.score}</p>
            <p className="text-green">
              {parseFloat(String(data.runtime * 1000)).toFixed(1)} milliseconds
            </p>
            {/* Render other components based on the parsed data */}
          </>
        </div>
        <button
          className="w-fit bg-green p-4"
          onClick={() => saveAndDownloadSolution()}
        >
          Simpan solusi dan Download
        </button>
      </div>
    </main>
  );
}
