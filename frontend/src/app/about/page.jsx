"use client";

import { Shield, Zap, Users, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        About FlightGuard
                    </h1>
                    <p className="text-xl text-blue-100">
                        Revolutionizing flight insurance with blockchain technology
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Our Mission
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        FlightGuard was founded with a simple belief: flight insurance
                        should be transparent, instant, and hassle-free. Traditional
                        insurance requires claims, paperwork, and weeks of waiting. We knew
                        there had to be a better way.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        By leveraging blockchain technology and smart contracts, we've
                        created a system where payouts happen automatically when delays
                        occur. No forms to fill out, no claims to file, no waiting for
                        approval. Just instant compensation when you need it most.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
                        Our Values
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Transparency",
                                description:
                                    "Every transaction is recorded on the blockchain for complete visibility.",
                            },
                            {
                                icon: Zap,
                                title: "Speed",
                                description:
                                    "Automatic payouts within minutes of delay detection.",
                            },
                            {
                                icon: Users,
                                title: "Customer First",
                                description:
                                    "Built for travelers, by travelers who understand the pain of delays.",
                            },
                            {
                                icon: Award,
                                title: "Innovation",
                                description:
                                    "Pioneering the future of insurance with cutting-edge technology.",
                            },
                        ].map((value, idx) => {
                            const Icon = value.icon;
                            return (
                                <div key={idx} className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {value.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Built by Experts
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                        Our team combines decades of experience in aviation, insurance, and
                        blockchain technology to deliver the most reliable flight protection
                        platform in the world.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105"
                    >
                        Get in Touch
                    </Link>
                </div>
            </section>
        </main>
    );
}

