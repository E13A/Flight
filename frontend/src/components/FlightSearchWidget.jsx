"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FlightSearchWidget() {
    const router = useRouter();
    const [searchData, setSearchData] = useState({
        origin: "",
        destination: "",
        departDate: "",
        passengers: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Encode search params and navigate
        const params = new URLSearchParams({
            origin: searchData.origin,
            destination: searchData.destination,
            date: searchData.departDate,
            passengers: searchData.passengers.toString(),
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-5xl mx-auto border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Origin */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            From
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Origin city"
                                value={searchData.origin}
                                onChange={(e) =>
                                    setSearchData({ ...searchData, origin: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            To
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Destination city"
                                value={searchData.destination}
                                onChange={(e) =>
                                    setSearchData({ ...searchData, destination: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Departure
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={searchData.departDate}
                                onChange={(e) =>
                                    setSearchData({ ...searchData, departDate: e.target.value })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Passengers
                        </label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={searchData.passengers}
                                onChange={(e) =>
                                    setSearchData({
                                        ...searchData,
                                        passengers: parseInt(e.target.value),
                                    })
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "Passenger" : "Passengers"}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                    <Search className="w-5 h-5" />
                    Search Flights
                </button>
            </form>
        </div>
    );
}

