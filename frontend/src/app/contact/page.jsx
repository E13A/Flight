"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
        }, 3000);
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Have questions? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Email
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        support@flightguard.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Phone
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        +1 (555) 123-4567
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                        Office
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        123 Blockchain Ave
                                        <br />
                                        San Francisco, CA 94102
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitted}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02]"
                                >
                                    {submitted ? (
                                        <>
                                            <span>Message Sent!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

