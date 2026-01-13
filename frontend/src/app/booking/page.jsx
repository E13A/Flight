"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Plane, CreditCard, ChevronRight, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth";
import "@/styles/pages/booking.css";

function BookingContent() {
    const searchParams = useSearchParams();
    const flightId = searchParams.get('flightId');
    const { addToast } = useToast();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [insurance, setInsurance] = useState(true);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [passport, setPassport] = useState("");

    useEffect(() => {
        setMounted(true);
        if (flightId) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/flights/${flightId}`)
                .then(res => res.json())
                .then(data => {
                    const mapped = {
                        id: data.flightId,
                        airline: "Global Air",
                        number: `GA${data.flightId}`,
                        from: data.origin,
                        to: data.destination,
                        dep: new Date(data.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        arr: new Date(data.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        depDate: new Date(data.departureTime).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }),
                        price: 500, // Placeholder price logic
                        tax: 50
                    };
                    setFlight(mapped);
                })
                .catch(err => console.error("Failed to load flight", err));
        }
    }, [flightId]);

    const handleBookForMe = () => {
        if (user) {
            if (user.full_name) {
                const parts = user.full_name.split(' ');
                setFirstName(parts[0]);
                setLastName(parts.slice(1).join(' '));
            }
            if (user.email) setEmail(user.email);
            // user object doesn't have passport yet, so we leave it or partial fill
        }
    };

    const handleBooking = async () => {
        if (!flightId) {
            addToast("No flight selected", "error");
            return;
        }

        if (!firstName || !lastName || !email || !passport) {
            addToast("Please fill in all passenger details", "error");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/bookings/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    ...(user ? { "Authorization": `Bearer ${localStorage.getItem('token')}` } : {})
                },
                body: JSON.stringify({
                    // If backend supports user_id from token, great. Else hardcode or pass explicitly.
                    // For now, let's assume backend might infer from token or we send guest ID?
                    // The original code had user_id: 1. Let's keep using 1 or user.id if available.
                    user_id: user?.id || 1,
                    flight_id: parseInt(flightId),
                    with_insurance: insurance,
                    passenger_details: { // Assuming backend might want this? Or just standard booking?
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        passport_number: passport
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                addToast(`Booking Confirmed! ID: ${data.booking_id}`, "success", 5000);
            } else {
                addToast("Booking failed. Please try again.", "error");
            }
        } catch (e) {
            console.error(e);
            addToast("Network error connecting to server", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!flightId) return <div className="p-8 text-center">Please select a flight first.</div>;
    if (!flight) return <div className="p-8 text-center">Loading flight details...</div>;

    const totalPrice = flight.price + flight.tax + (insurance ? 45 : 0);

    return (
        <div className="booking-page container mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                <span>Flights</span>
                <ChevronRight className="w-4 h-4" />
                <span>{flight.from} to {flight.to}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-blue-600 font-medium">Booking</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Passenger Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Passenger Details</CardTitle>
                                <CardDescription>Enter the details for the passenger.</CardDescription>
                            </div>
                            {mounted && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    onClick={user ? handleBookForMe : () => addToast("Please sign in to use this feature", "info")}
                                    disabled={!user}
                                    title={user ? "Auto-fill my details" : "Sign in to auto-fill details"}
                                >
                                    <UserIcon className="w-4 h-4" />
                                    {user ? "Book for me" : "Sign in to book for me"}
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">First Name</label>
                                    <Input
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Last Name</label>
                                    <Input
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Passport Number</label>
                                <Input
                                    placeholder="A12345678"
                                    value={passport}
                                    onChange={(e) => setPassport(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`border transition-colors shadow-sm ${insurance ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800'}`}>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-blue-900 dark:text-blue-100">Flight Delay Insurance</CardTitle>
                                    <CardDescription className="text-blue-600 dark:text-blue-300">Smart contract protection</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-1">
                                    <div
                                        className={`flex justify-between items-center p-4 rounded-lg border shadow-sm mb-2 cursor-pointer transition-colors ${insurance ? 'border-blue-500 bg-white dark:bg-slate-950' : 'border-slate-200 bg-slate-50 dark:bg-slate-900'}`}
                                        onClick={() => setInsurance(!insurance)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                                                checked={insurance}
                                                readOnly
                                            />
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">Premium Protection</p>
                                                <p className="text-xs text-slate-500">Payouts for delays &gt; 2 hours</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-blue-600">$45.00</span>
                                    </div>
                                    <p className="text-xs text-slate-500 ml-1">
                                        * Automatically executes via Smart Contract.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="space-y-6">
                    <Card className="border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-sm sticky top-24">
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                                <Plane className="w-5 h-5 text-slate-400 mt-1" />
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{flight.from} → {flight.to}</p>
                                    <p className="text-sm text-slate-500">{flight.airline} • {flight.number}</p>
                                    <p className="text-sm text-slate-500">{flight.depDate} • {flight.dep} - {flight.arr}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Flight Ticket</span>
                                    <span className="font-medium">${flight.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Taxes & Fees</span>
                                    <span className="font-medium">${flight.tax.toFixed(2)}</span>
                                </div>
                                {insurance && (
                                    <div className="flex justify-between text-sm text-blue-600">
                                        <span>Delay Insurance</span>
                                        <span className="font-medium">$45.00</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                                onClick={handleBooking}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Confirm & Pay"}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                                <CreditCard className="w-3 h-3" /> Secure Payment
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}
