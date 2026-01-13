"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Modal({ isOpen, onClose, title, children, className }) {
    const overlayRef = React.useRef(null)

    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            ref={overlayRef}
            onClick={handleOverlayClick}
        >
            <div
                className={cn(
                    "bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-lg relative animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
