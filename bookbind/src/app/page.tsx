import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Library from "@/components/Library";

export default async function Home() {
  const user = await currentUser();
  return (
    user ? <Library/> : null
  )
}
