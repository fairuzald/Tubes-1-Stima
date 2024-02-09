import Link from "next/link";
import Client from "./client";

export default function Home() {
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
       <Client/>
  

        </div>
      </div>
    </main>
  );
}
