"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Filter, Plane, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { useFlights } from "@/hooks/useFlights";
import { useSearchParams } from "next/navigation";



function FlightCard({ flight }) {
    // Calculate duration from departure and arrival times
    const getDuration = () => {
        try {
            const dep = new Date(flight.departureTime);
            const arr = new Date(flight.arrivalTime);
            const diffMs = arr.getTime() - dep.getTime();
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours}h ${mins.toString().padStart(2, '0')}m`;
        } catch {
            return "N/A";
        }
    };

    // Format time for display
    const formatTime = (isoString) => {
        try {
            return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return isoString;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Flight Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {flight.airline}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {flight.flight_number} • {flight.aircraft || "Boeing 737"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatTime(flight.departureTime)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {flight.origin}
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{getDuration()}</span>
                            </div>
                            <div className="w-full h-px bg-gray-300 dark:bg-gray-600 my-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Direct
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatTime(flight.arrivalTime)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {flight.destination}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${flight.price}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            per passenger
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Shield className="w-4 h-4" />
                        <span>Insurance +$25</span>
                    </div>

                    <Link
                        href={`/booking/${flight.id}`}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 text-center"
                    >
                        Select Flight
                    </Link>
                </div>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div>
                            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="flex flex-col items-center justify-center">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2" />
                            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="text-right">
                            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 ml-auto" />
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                    <div className="text-right">
                        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 ml-auto" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded ml-auto" />
                    </div>
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

function SearchContent() {
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin") || "";
    const destination = searchParams.get("destination") || "";
    const date = searchParams.get("date") || "";

    const { data: flights, isLoading, error } = useFlights({ origin, destination, date });

    const [filters, setFilters] = useState({
        maxPrice: 1000,
        airline: "all",
        stops: "all",
    });

    const filteredFlights = (flights || []).filter((flight) => {
        const price = flight.price || flight.base_price || 0;
        const matchesPrice = price <= filters.maxPrice;
        const matchesAirline =
            filters.airline === "all" || flight.airline === filters.airline;
        // const matchesStops = filters.stops === "all" || flight.stops.toString() === filters.stops;
        return matchesPrice && matchesAirline;
    });

    return (
        <>
            {/* Search Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Available Flights
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Showing all available flights
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors">
                        <Search className="w-4 h-4" />
                        Modify Search
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                        <div className="flex items-center gap-2 mb-6">
                            <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Filters
                            </h2>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <label
                                htmlFor="price-filter"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Max Price: ${filters.maxPrice}
                            </label>
                            <input
                                id="price-filter"
                                type="range"
                                min="0"
                                max="1000"
                                step="50"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters({
                                        ...filters,
                                        maxPrice: parseInt(e.target.value),
                                    })
                                }
                                className="w-full"
                                aria-label="Maximum price filter"
                            />
                        </div>

                        {/* Airline Filter */}
                        <div className="mb-6">
                            <label
                                htmlFor="airline-filter"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            >
                                Airline
                            </label>
                            <select
                                id="airline-filter"
                                value={filters.airline}
                                onChange={(e) =>
                                    setFilters({ ...filters, airline: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Airlines</option>
                                <option value="Turkish Airlines">Turkish Airlines</option>
                                <option value="AZAL">AZAL</option>
                            </select>
                        </div>

                        {/* Stops Filter */}
                        <div className="mb-6">
                            <fieldset>
                                <legend className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Stops
                                </legend>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="stops"
                                            value="all"
                                            checked={filters.stops === "all"}
                                            onChange={(e) =>
                                                setFilters({ ...filters, stops: e.target.value })
                                            }
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            All
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="stops"
                                            value="0"
                                            checked={filters.stops === "0"}
                                            onChange={(e) =>
                                                setFilters({ ...filters, stops: e.target.value })
                                            }
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Direct only
                                        </span>
                                    </label>
                                </div>
                            </fieldset>
                        </div>

                        <button
                            onClick={() =>
                                setFilters({ maxPrice: 1000, airline: "all", stops: "all" })
                            }
                            className="w-full px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                </aside>

                {/* Flight Results */}
                <div className="lg:col-span-3">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-gray-600 dark:text-gray-400">
                            {isLoading
                                ? "Searching..."
                                : `${filteredFlights.length} flights found`}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        ) : error ? (
                            <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                                Error loading flights. Please try again.
                            </div>
                        ) : filteredFlights.length > 0 ? (
                            filteredFlights.map((flight) => (
                                <FlightCard key={flight.id} flight={flight} />
                            ))
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                                <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    No flights found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Try adjusting your filters or search criteria
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6"
                    aria-label="Breadcrumb"
                >
                    <Link
                        href="/"
                        className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">Search Flights</span>
                </nav>
                <Suspense
                    fallback={
                        <div className="w-full h-96 flex items-center justify-center">
                            <SkeletonCard />
                        </div>
                    }
                >
                    <SearchContent />
                </Suspense>
            </div>
        </main>
    );
}

