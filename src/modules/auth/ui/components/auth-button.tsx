"use client";

import {Button } from "@/components/ui/button"
import {ClapperboardIcon, UserCircleIcon} from "lucide-react"
import {UserButton, SignInButton, SignedOut, SignedIn, SignOutButton} from "@clerk/nextjs"

export const AuthButton = () => {
    return(
        <>
        <SignedIn>
            <UserButton>
                <UserButton.MenuItems>
                    <UserButton.Link
                         href="/studio"
                    label="Studio"
                    labelIcon={<ClapperboardIcon className="size-4"/>}
                    />
                    <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
            </UserButton>
        </SignedIn>
        <SignedOut>
           <SignInButton>
        <Button
         variant="outline"
         className=" px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
        >
        <UserCircleIcon/>
        Sign in
        </Button>
           </SignInButton>
        </SignedOut>
        </>
    )
}