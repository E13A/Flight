"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Toast({
    message,
    type = "success",
    onClose,
    duration = 3000,
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
    };

    const colors = {
        success: "bg-green-500",
        error: "bg-red-500",
    };

    const Icon = icons[type];

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div
                className={cn(
                    colors[type],
                    "text-white rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]"
                )}
            >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
