import { serverClient } from './_trpc/serverClient'

const Tests = async () =>{
  "use server"
  const tests = await serverClient.getTests()

  return (
    <ul>
      {tests.map((test) => (
        <li key={test.id}>{test.id}</li>
      ))}
    </ul>
  )
}

export default function Home() {

  return (
    <main>
      <h1>Creator Bingo</h1>
      <Tests />
    </main>
  )
}
