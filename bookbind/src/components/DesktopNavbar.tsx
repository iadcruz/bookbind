import { Library, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <Library className="w-4 h-4" />
          <span className="hidden lg:inline">Library</span>
        </Link>
      </Button>
      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
      <ModeToggle />
    </div>
  );
}
export default DesktopNavbar;