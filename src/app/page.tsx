import { CreatorToast } from "./_components/CreatorToast";

export default async function Home() {
  return (
    <main>
      <h1 className="text-lg font-semibold">Homepage</h1>

      <CreatorToast />
    </main>
  );
}

// example iframe
// <iframe
//     width="100%"
//     height="315"
//     onTimeUpdate={console.log}
//     onTimeUpdateCapture={console.log}
//     src="https://www.youtube.com/embed/CQchvFxE7WA"
//     title="It&#39;s been a year..."
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//     allowFullScreen
//   ></iframe>
