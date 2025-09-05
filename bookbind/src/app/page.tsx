import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Library from "@/components/Library";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
      <div className="lg:col-span-4">
        {user ? <Library/> : null}
      </div>
    </div>
  )
}
