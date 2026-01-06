"use client"

import { trpc } from "@/trpc/client"

export const  PageClient = () => {
    const [data] = trpc.categories.getMany.useSuspenseQuery()

    return (
        <div>
           {JSON.stringify(data)}
        </div>
    )
} 
