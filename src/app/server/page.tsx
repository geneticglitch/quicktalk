import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 flex-wrap">
        <pre>
          <h1>serverside auth test</h1>
          {JSON.stringify(session)}
        </pre>
      </main>
    </div>  
  );
}