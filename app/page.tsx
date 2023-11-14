import { generateBoard } from "@/utils";
import { serverClient } from "./_trpc/serverClient";

const Tests = async () => {
  "use server";
  const tests = await serverClient.getTests();

  return (
    <ul>
      {tests.map((test) => (
        <li key={test.id}>{test.id}</li>
      ))}
    </ul>
  );
};

export default function Home() {
  const board = generateBoard();

  return (
    <main className="w-screen h-screen">
      <div className="grid gap-8 border-4 border-black aspect-square xl:max-w-[50%]">
        {board.map((row, i) => (
          <div className="w-full flex flex-row" key={i}>
            {row.map((cell, j) => (
              <span className={`w-[${100/5}%] border-2 text-center`} key={j}>{cell.text}</span>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
