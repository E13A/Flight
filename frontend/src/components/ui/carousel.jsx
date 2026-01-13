"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Carousel({ items, autoPlay = false, interval = 5000, className, ...props }) {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isPaused, setIsPaused] = React.useState(false)

    React.useEffect(() => {
        if (!autoPlay || isPaused) return

        const timer = setInterval(() => {
            next()
        }, interval)

        return () => clearInterval(timer)
    }, [currentIndex, autoPlay, isPaused, interval])

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
    }

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    }

    return (
        <div
            className={cn("relative group overflow-hidden rounded-xl", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            {...props}
        >
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {items.map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 h-full">
                        {item}
                    </div>
                ))}
            </div>

            <div className="absolute inset-y-0 left-0 flex items-center justify-start px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={prev} className="rounded-full bg-white/80 hover:bg-white backdrop-blur-sm">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center justify-end px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={next} className="rounded-full bg-white/80 hover:bg-white backdrop-blur-sm">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all",
                            index === currentIndex ? "bg-white w-4" : "bg-white/50 hover:bg-white/75"
                        )}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}
