"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function AccordionItem({ title, children, isOpen, onToggle, className }) {
    return (
        <div className={cn("border-b dark:border-slate-800", className)}>
            <button
                className="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline"
                onClick={onToggle}
            >
                {title}
                <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden text-sm transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                )}
            >
                {children}
            </div>
        </div>
    )
}

export function Accordion({ items, className, allowMultiple = false }) {
    const [openIndexes, setOpenIndexes] = React.useState([])

    const handleToggle = (index) => {
        if (allowMultiple) {
            setOpenIndexes(prev =>
                prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
            )
        } else {
            setOpenIndexes(prev =>
                prev.includes(index) ? [] : [index]
            )
        }
    }

    return (
        <div className={cn("divide-y dark:divide-slate-800", className)}>
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={openIndexes.includes(index)}
                    onToggle={() => handleToggle(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    )
}
