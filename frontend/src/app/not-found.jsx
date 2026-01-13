import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="mb-8 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center animate-bounce">
                <Plane className="w-12 h-12 text-blue-600 dark:text-blue-400 transform rotate-12" />
            </div>
            <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-6">Flight Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed">
                We couldn't find the page you're looking for. It might have been delayed, cancelled, or rerouted.
            </p>
            <Link href="/">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                    Return Home
                </Button>
            </Link>
        </div>
    );
}

