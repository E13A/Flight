"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Plane, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import "@/styles/pages/flights.css";

export default function FlightsPage() {
    const [loading, setLoading] = useState(false);
    const [flights, setFlights] = useState([]);

    const [fromLoc, setFromLoc] = useState("");
    const [toLoc, setToLoc] = useState("");
    const [date, setDate] = useState("");

    const searchFlights = async () => {
        setLoading(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (fromLoc) params.append("origin", fromLoc);
            if (toLoc) params.append("destination", toLoc);
            if (date) params.append("date", date);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/flights/?${params.toString()}`);
            const data = await res.json();

            const mapped = data.map((f) => ({
                id: f.flightId,
                airline: "Global Air",
                number: `GA${f.flightId}`,
                from: f.origin,
                to: f.destination,
                dep: new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                arr: new Date(f.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                price: "$500",
                duration: "4h"
            }));
            setFlights(mapped);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flights-page container mx-auto px-4 py-8">
            {/* Search Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Find Your Flight</h1>
                <p className="text-slate-500 dark:text-slate-400">Search for flights to insure against delays.</p>
            </div>

            {/* Search Bar */}
            <Card className="mb-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        {/* Inputs ... */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">From</label>
                            <div className="relative">
                                <Plane className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Origin (e.g. LHR)"
                                    className="pl-10"
                                    value={fromLoc}
                                    onChange={(e) => setFromLoc(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">To</label>
                            <div className="relative">
                                <Plane className="absolute left-3 top-3 w-4 h-4 text-slate-400 transform rotate-90" />
                                <Input
                                    placeholder="Destination (e.g. JFK)"
                                    className="pl-10"
                                    value={toLoc}
                                    onChange={(e) => setToLoc(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    type="date"
                                    className="pl-10"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={searchFlights} disabled={loading}>
                            {loading ? "Searching..." : (
                                <><Search className="w-4 h-4 mr-2" /> Search Flights</>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="grid gap-4">
                {flights.length === 0 && !loading && (
                    <div className="text-center text-slate-500 py-12">
                        Click search to view available flights
                    </div>
                )}

                {flights.map((flight) => (
                    <div key={flight.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <Plane className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{flight.dep}</h3>
                                    <span className="text-slate-400 text-sm">→</span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{flight.arr}</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{flight.airline} • {flight.number} • {flight.duration}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Ticket Price</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{flight.price}</p>
                            </div>
                            <Link href={`/booking?flightId=${flight.id}`}>
                                <Button className="rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90">
                                    Select <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

