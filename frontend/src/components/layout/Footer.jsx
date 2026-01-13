import Link from "next/link";
import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                FD
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">FlightDelay</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Automatic Blockchain-Powered Flight Delay Insurance.
                            Get paid instantly when your flight is delayed. No paperwork, no hassle.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link href="/flights" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Find Flights</Link></li>
                            <li><Link href="/insurance" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Policies</Link></li>
                            <li><Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">My Dashboard</Link></li>
                            <li><Link href="/how-it-works" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">How it Works</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="/terms" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookie" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        © 2024 FlightDelay DApp. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

