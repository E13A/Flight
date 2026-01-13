"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext(undefined)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([])

    const addToast = (message, type = "info", duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type, duration }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

function ToastItem({ toast, onClose }) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    }

    return (
        <div className={cn(
            "flex items-center gap-3 min-w-[300px] p-4 rounded-lg shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-right-full duration-300"
        )}>
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="h-4 w-4 text-slate-500" />
            </button>
        </div>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
