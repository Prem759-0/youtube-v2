"use client"

import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { Loader2, SearchIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //TODO: handle search
        const url = new URL("/search", APP_URL);
        const newQuery = value.trim();

        url.searchParams.set("query", encodeURIComponent(newQuery));

        if (newQuery === ""){
            url.searchParams.delete("query")
        }

        setValue(newQuery);
        startTransition(() => {
            router.push(url.toString());
        });
    }
    return(
        <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
            <div className="relative w-full">
                <input
                value={value}
                onChange={(e)=> setValue(e.target.value)}
                   type="text"
                   placeholder="Search"
                 className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500"
                />
                {value && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setValue("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                      <XIcon className="text-gray-500" />
                    </Button>
                )}
            </div>
            <button
              disabled={!value.trim() || isPending}
              type="submit"
              className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isPending ? (
                   <Loader2 className="size-5 animate-spin"/>
               ) : (
                   <SearchIcon className="size-5"/>
               )}
            </button>

        </form>  
    )
}