"use client";

import { useState } from "react";
import { Menu, X, Plane, User, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { user, isAuthenticated, logout, loading } = useAuth();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/search", label: "Search Flights" },
        { href: "/insurance", label: "Insurance" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            FlightGuard
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {!loading && (
                            <>
                                {isAuthenticated ? (
                                    <div className="hidden sm:flex items-center gap-3">
                                        <Link
                                            href="/dashboard"
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="font-medium">{user?.username || "User"}</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="hidden sm:flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col gap-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* Mobile Auth Buttons */}
                            {!loading && (
                                <>
                                    {isAuthenticated ? (
                                        <>
                                            <div className="px-4 py-2 text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>Logged in as <strong>{user?.username}</strong></span>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/login"
                                                className="px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
