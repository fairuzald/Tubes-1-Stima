"use client";
import { saveAndDownloadSolution } from "@/lib/download";
import { makeApiRequest } from "@/lib/helper";
import { randomizeMatrix, randomizeTarget } from "@/lib/random";
import { getColumnCount, getRowCount } from "@/lib/utils";
import { Matrix, Target } from "@/types";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";


export default function Home() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [matrix, setMatrix] = useState<Matrix>({});
  const [buffer, setBuffer] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [col, setCol] = useState<number>(0);
  const [row, setRow] = useState<number>(0);
  const [countTarget, setCountTarget] = useState<number>(0);

  const handleClick = async () => {
    if (col < 1 || row < 1 || buffer < 1 || countTarget < 1) {
      toast.error("Tinggi, lebar, buffer, dan target count harus lebih dari 0");
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
        <h2 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl">Pilih Metode Input Lain:</h2>
        <div className="text-white p-2 rounded-md flex gap-5">
          <Link className="text-base lg:text-xl bg-green py-3 px-4 rounded-lg" href="/randomize">
            <p>Manual</p>
          </Link>
          <Link className="text-base lg:text-xl bg-green py-3 px-4 rounded-lg" href="/">
            <p>File Input</p>
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <>
              <div className="flex flex-wrap items-stretch gap-6 text-black">
                <div className="flex flex-col">
                  <label className="text-white text-lg">Masukkan tinggi matrix</label>
                  <input className="bg-white py-3 px-4 outline-none rounded-lg" type="number" value={row} onChange={(e) => setRow(parseInt(e.target.value))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-white text-lg">Masukkan lebar matrix</label>
                  <input className="bg-white py-3 px-4 outline-none rounded-lg" type="number" value={col} onChange={(e) => setCol(parseInt(e.target.value))} />

                </div>
                <div className="flex flex-col">
                  <label className="text-white text-lg">Masukkan ukuran buffer</label>
                  <input className="bg-white py-3 px-4 outline-none rounded-lg" type="number" value={buffer} onChange={(e) => setBuffer(parseInt(e.target.value))} />

                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  className="bg-light-green w-fit text-black font-bold text-base lg:text-xl py-3 px-4 rounded-xl"
                  onClick={() => { setMatrix(randomizeMatrix(row, col)) }}
                >
                  Randomize Matrix
                </button>
                <div className="flex flex-col gap-2 text-black">
                  <label className="text-white text-lg">Masukkan random target count</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input className="bg-white py-3 px-4 outline-none rounded-lg" type="number" value={countTarget} onChange={(e) => setCountTarget(parseInt(e.target.value))} />
                    <button
                      className="bg-light-green w-fit text-black font-bold text-base lg:text-xl py-3 px-4 rounded-xl"
                      onClick={() => setTargets(randomizeTarget(matrix, countTarget, buffer))}
                    >
                      Randomize Target
                    </button>
                  </div>

                </div>
              </div>

            </>
          </div>
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
                {
                  Boolean(data.result?.string) &&
                  <p className="text-green">Points: {data.result?.score}</p>

                }
                {
                  Boolean(data) &&
                  <p className="text-green">Runtime: {parseFloat(String(data.runtime * 1000)).toFixed(1)} ms</p>
                }
              </div>
            </div>
            <div className="flex flex-col">
              {targets.map((target, index) => (
                <p key={index} className="text-white">
                  Target {index + 1}: {target.sequence.join("")} - {target.points}
                </p>
              ))}
            </div>
          </div>



          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {matrix &&
              <button
                className="bg-light-green w-fit text-black font-bold text-base lg:text-xl py-3 px-4 rounded-xl disabled:cursor-not-allowed"
                onClick={handleClick}
                disabled={Object.keys(matrix).length < 1 || targets.length < 1}
              >
                Submit
              </button>
            }
            {Boolean(data.result) && (
              <button
                className="w-fit bg-green p-4 text-base lg:text-xl rounded-xl"
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
