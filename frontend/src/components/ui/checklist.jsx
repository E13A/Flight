"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Checklist({ items, onChange, width = "full", className }) {
    return (
        <div className={cn("flex flex-col space-y-2", className, width === "full" ? "w-full" : `w-[${width}]`)}>
            {items.map((item) => (
                <label
                    key={item.id}
                    className={cn(
                        "flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800",
                        item.checked
                            ? "border-slate-900 bg-slate-50 dark:border-slate-400 dark:bg-slate-900"
                            : "border-slate-200 dark:border-slate-800"
                    )}
                >
                    <div className={cn(
                        "relative flex items-center justify-center w-5 h-5 mr-3 rounded border transition-colors",
                        item.checked
                            ? "bg-slate-900 border-slate-900 dark:bg-slate-50 dark:border-slate-50 text-white dark:text-black"
                            : "border-slate-400 bg-transparent"
                    )}>
                        <input
                            type="checkbox"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            checked={item.checked}
                            onChange={(e) => onChange(item.id, e.target.checked)}
                        />
                        {item.checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={cn(
                        "text-sm font-medium select-none",
                        item.checked ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                    )}>
                        {item.label}
                    </span>
                </label>
            ))}
        </div>
    )
}
