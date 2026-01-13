"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function RadioGroup({ options, value, onChange, name, className }) {
    return (
        <div className={cn("space-y-2", className)} role="radiogroup">
            {options.map((option) => (
                <label
                    key={option.value}
                    className={cn(
                        "flex items-start p-4 border rounded-lg cursor-pointer transition-all",
                        value === option.value
                            ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900 dark:border-slate-100 dark:bg-slate-900 dark:ring-slate-100"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    )}
                >
                    <div className="flex items-center h-5">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="w-4 h-4 text-slate-900 border-slate-300 focus:ring-slate-900 dark:focus:ring-slate-300"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <span className={cn("block font-medium", value === option.value ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>
                            {option.label}
                        </span>
                        {option.description && (
                            <span className="block mt-1 text-slate-500 dark:text-slate-400">
                                {option.description}
                            </span>
                        )}
                    </div>
                </label>
            ))}
        </div>
    )
}
