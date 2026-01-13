"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Wallet } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/flights", label: "Flights" },
        { href: "/insurance", label: "Insurance" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/about", label: "About" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                        FD
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200">
                        FlightDelay
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400",
                                pathname === link.href
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button variant="outline" size="sm" className="hidden lg:flex gap-2 rounded-full border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                        <Wallet className="w-4 h-4" />
                        Connect Wallet
                    </Button>
                    <Link href="/contact">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 p-4 flex flex-col gap-4 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={cn(
                                "text-base font-medium p-2 rounded-md transition-colors",
                                pathname === link.href
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
                    <Button className="w-full gap-2 bg-blue-600 text-white rounded-full">
                        <Wallet className="w-4 h-4" /> Connect Wallet
                    </Button>
                </div>
            )}
        </header>
    );
}

