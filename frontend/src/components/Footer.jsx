"use client";

import { Plane, Twitter, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: [
                { label: "Search Flights", href: "/search" },
                { label: "Insurance Plans", href: "/insurance" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pricing", href: "/insurance" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "/about" },
                { label: "Blog", href: "/about" },
            ],
        },
        {
            title: "Resources",
            links: [
                { label: "Documentation", href: "/about" },
                { label: "Help Center", href: "/contact" },
                { label: "Privacy Policy", href: "/about" },
                { label: "Terms of Service", href: "/about" },
            ],
        },
        {
            title: "Blockchain",
            links: [
                { label: "Smart Contracts", href: "/about" },
                { label: "Audit Reports", href: "/about" },
                { label: "Network Status", href: "/about" },
                { label: "Developer API", href: "/about" },
            ],
        },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">FlightGuard</span>
                        </Link>
                        <p className="text-gray-400 mb-4 max-w-sm">
                            Smart flight insurance powered by blockchain technology. Automatic
                            payouts, zero hassle.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} FlightGuard. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link
                                href="/about"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

