"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumbs({ items, className }) {
    return (
        <nav className={cn("flex", className)} aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                            <Link
                                href={item.href}
                                className={cn(
                                    "ml-1 text-sm font-medium md:ml-2",
                                    index === items.length - 1
                                        ? "text-slate-500 pointer-events-none cursor-default dark:text-slate-500"
                                        : "text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
