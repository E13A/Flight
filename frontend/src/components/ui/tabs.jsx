"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext(undefined)

export function Tabs({ defaultValue, children, className }) {
    const [value, setValue] = React.useState(defaultValue)

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ children, className }) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400", className)}>
            {children}
        </div>
    )
}

export function TabsTrigger({ value, children, className }) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                context.value === value
                    ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                    : "hover:bg-gray-200/50 dark:hover:bg-slate-700/50",
                className
            )}
            onClick={() => context.setValue(value)}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, children, className }) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== value) return null

    return (
        <div
            className={cn(
                "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
                className
            )}
        >
            {children}
        </div>
    )
}
