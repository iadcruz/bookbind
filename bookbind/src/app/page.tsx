import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Library from "@/components/Library";
import { Card, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default async function Home() {
  const user = await currentUser();
  return (
    user ? <Library/> : <div className="text-center align-middle"><h1 className="inline-block">Sign in to continue</h1><ShieldAlert className="inline-block size-7 pl-2"/></div>
  )
}
