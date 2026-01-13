"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from "lucide-react";
import ThreeScene from "@/components/ThreeScene";
import FlightSearchWidget from "@/components/FlightSearchWidget";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Three.js Background */}
        <div className="absolute inset-0 z-0">
          <ThreeScene />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-800/20 z-10 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-none">
          <div
            className={cn(
              "transition-all duration-1000 pointer-events-auto",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
              Smart Flight Insurance
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mt-2">
                That Pays You Back Automatically
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Book flights with confidence. Get instant blockchain-powered
              payouts when delays happen. No claims, no hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/search"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Search Flights
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/insurance"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                Learn About Insurance
              </Link>
            </div>
          </div>

          {/* Search Widget */}
          <div
            className={cn(
              "transition-all duration-1000 delay-300 pointer-events-auto",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <FlightSearchWidget />
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Blockchain-powered insurance that actually works for you
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 - Large */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Automatic Payouts</h3>
            <p className="text-blue-100 text-lg">
              Smart contracts automatically detect delays and trigger instant
              refunds to your wallet. No paperwork, no waiting.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
            <Zap className="w-12 h-12 mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Blockchain transactions complete in seconds, not days.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700">
            <Globe className="w-12 h-12 mb-4 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Global Coverage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book flights from Turkish Airlines, AZAL, and more providers
              worldwide.
            </p>
          </div>

          {/* Feature 4 - Large */}
          <div className="md:col-span-2 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]">
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Transparent & Trustless</h3>
            <p className="text-green-100 text-lg">
              All transactions recorded on-chain. Verify every payout, every
              policy, every time. Complete transparency guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Three simple steps to protected travel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search & Book",
                description:
                  "Find your perfect flight from multiple airlines and book instantly with our streamlined checkout.",
              },
              {
                step: "02",
                title: "Add Insurance",
                description:
                  "Choose a protection plan during checkout. Smart contracts activate automatically upon payment.",
              },
              {
                step: "03",
                title: "Get Paid Automatically",
                description:
                  "If your flight is delayed, our system detects it and sends your refund directly to your wallet.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-6xl font-bold text-blue-600/20 dark:text-blue-400/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Fly with Confidence?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of travelers who trust blockchain-powered insurance
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Booking Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

