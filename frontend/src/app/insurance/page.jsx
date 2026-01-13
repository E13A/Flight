"use client";

import { useState } from "react";
import {
    Shield,
    Check,
    ChevronDown,
    ChevronUp,
    Zap,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePolicyPlans } from "@/hooks/usePolicies";

// Plans fetched from API

const FAQ_ITEMS = [
    {
        question: "How does automatic payout work?",
        answer:
            "Our smart contracts monitor flight data in real-time. When a delay is detected that meets your policy threshold, the payout is automatically triggered and sent to your connected wallet within minutes. No forms, no waiting, no hassle.",
    },
    {
        question: "What delays are covered?",
        answer:
            "Coverage depends on your plan: Basic covers delays of 3+ hours, Standard covers 2+ hours, and Premium covers 1+ hour delays. All plans use verified flight data from multiple sources to ensure accuracy.",
    },
    {
        question: "How secure is the blockchain payment?",
        answer:
            "All transactions are secured by smart contracts on the blockchain, making them transparent, immutable, and trustless. Your funds are held in escrow and automatically released when conditions are met. The system has been audited by leading security firms.",
    },
    {
        question: "Can I purchase insurance after booking?",
        answer:
            "Insurance must be purchased at the time of booking or within 24 hours of your original purchase. This ensures the smart contract can be properly initialized with your flight details.",
    },
    {
        question: "What if my flight is cancelled?",
        answer:
            "Standard and Premium plans include cancellation coverage. If your flight is cancelled by the airline, you'll receive compensation according to your policy terms, processed automatically through the blockchain.",
    },
    {
        question: "How do I receive my payout?",
        answer:
            "Payouts are sent directly to your connected cryptocurrency wallet. You can also opt to receive payment via traditional methods, though blockchain payouts are instant while traditional methods may take 3-5 business days.",
    },
];

function AccordionItem({
    question,
    answer,
    isOpen,
    onClick,
}) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
                onClick={onClick}
                className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold text-gray-900 dark:text-white">
                    {question}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-700 dark:text-gray-300">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function InsurancePage() {
    const [openFaq, setOpenFaq] = useState(null);
    const { data: plans, isLoading, error } = usePolicyPlans();

    const getColorForPlan = (id) => {
        switch (id) {
            case "basic": return "blue";
            case "standard": return "green";
            case "premium": return "purple";
            default: return "blue";
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        Flight Insurance, Reimagined
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Powered by blockchain technology for instant, automatic payouts when
                        your flight is delayed. No claims, no paperwork, no waiting.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold">$2.5M+</div>
                            <div className="text-blue-200">Paid Out</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">15,000+</div>
                            <div className="text-blue-200">Protected Flights</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">98%</div>
                            <div className="text-blue-200">Satisfaction Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plans Comparison */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose Your Protection Level
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            All plans include automatic payouts and blockchain security
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            Error loading insurance plans. Please try again later.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans?.map((plan) => {
                                const color = getColorForPlan(plan.id);
                                // Ensure properties exist, fallback if needed
                                const recommended = plan.recommended;
                                const price = plan.price;
                                const coverage = plan.coverage;
                                const delay = plan.delay || "3+ hours"; // Fallback
                                const features = plan.features || [];

                                return (
                                    <div
                                        key={plan.id}
                                        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 transition-all duration-200 hover:scale-[1.02] ${recommended
                                            ? "border-green-500"
                                            : "border-gray-200 dark:border-gray-700"
                                            }`}
                                    >
                                        {recommended && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        <div className="p-8">
                                            <div className="text-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {plan.name}
                                                </h3>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className={`text-4xl font-bold ${color === "green" ? "text-green-600 dark:text-green-400" : color === "purple" ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"}`}>
                                                        ${price}
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        / flight
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Coverage up to ${coverage}
                                                </p>
                                            </div>

                                            <div className={`mb-6 p-4 rounded-lg text-center ${color === "green" ? "bg-green-50 dark:bg-green-900/20" : color === "purple" ? "bg-purple-50 dark:bg-purple-900/20" : "bg-blue-50 dark:bg-blue-900/20"}`}>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    Delays of{" "}
                                                    <span className={`font-bold ${color === "green" ? "text-green-600 dark:text-green-400" : color === "purple" ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"}`}>
                                                        {delay}
                                                    </span>
                                                </p>
                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                {features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Link
                                                href="/search"
                                                className={`block w-full px-6 py-3 rounded-lg font-semibold text-center transition-all duration-200 hover:scale-105 ${recommended
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                                    }`}
                                            >
                                                Get Started
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Simple, transparent, and fully automated
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                1. Purchase Protection
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Add insurance when booking your flight. Smart contract activates
                                instantly upon payment confirmation.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                2. Automatic Monitoring
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Our system tracks your flight in real-time using verified data
                                from multiple sources.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                3. Instant Payout
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                If a delay occurs, compensation is automatically sent to your
                                wallet within minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Everything you need to know about our insurance
                        </p>
                    </div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, index) => (
                            <AccordionItem
                                key={index}
                                question={item.question}
                                answer={item.answer}
                                isOpen={openFaq === index}
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Protect Your Next Flight?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of travelers who trust blockchain-powered insurance
                    </p>
                    <Link
                        href="/search"
                        className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Search Flights Now
                    </Link>
                </div>
            </section>
        </main>
    );
}

