"use client";

import { useState, use } from "react";
import {
    Plane,
    User,
    Mail,
    Phone,
    CreditCard,
    Shield,
    Check,
    AlertCircle,
    X,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateBooking } from "@/hooks/useBookings";
import { useFlight } from "@/hooks/useFlight";
import { usePolicyPlans } from "@/hooks/usePolicies";
import { validatePaymentCard } from "@/lib/payment";

export default function BookingPage({ params }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedInsuranceId, setSelectedInsuranceId] = useState("standard");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);

    // API Integration
    const { data: flight, isLoading: isFlightLoading } = useFlight(id);
    const { data: plans, isLoading: isPlansLoading } = usePolicyPlans();
    const { mutate: createBooking, isPending: isBookingPending } = useCreateBooking();

    const selectedPlan = plans?.find((p) => p.id === selectedInsuranceId) || null;

    // Derived State
    const basePrice = flight?.price || 0;
    const insurancePrice = selectedPlan?.price || 0;
    const totalPrice = basePrice + insurancePrice;

    const [paymentError, setPaymentError] = useState("");

    // ... imports need to be top level, so this part is tricky with replace_file_content if I want to add imports.
    // I will replace the imports separately or use multi_replace.
    // Actually, I can use multi_replace for this file to do both.

    const handleSubmit = (e) => {
        e.preventDefault();
        setPaymentError(""); // Clear previous errors

        // Final step submission
        if (step === 3) {
            // Validate Card
            const { valid, error } = validatePaymentCard(formData.cardNumber);
            if (!valid) {
                setPaymentError(error);
                return;
            }

            createBooking({
                flight_id: id,
                passenger_details: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                },
                insurance_plan_id: selectedInsuranceId === "none" ? undefined : selectedInsuranceId,
                payment_details: {
                    card_number: formData.cardNumber
                }
            }, {
                onSuccess: () => {
                    setShowSuccess(true);
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 3000);
                },
                onError: (error) => {
                    alert("Booking failed: " + (error.message || "Unknown error"));
                }
            });
        } else {
            setStep(s => s + 1);
        }
    };

    if (isFlightLoading || isPlansLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!flight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Flight Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">The flight you're looking for doesn't exist.</p>
                    <Link href="/search" className="text-blue-600 hover:underline">Back to Search</Link>
                </div>
            </div>
        );
    }

    // Success Modal
    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl text-center max-w-md">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Your flight and insurance have been booked successfully.</p>
                    <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link href="/search" className="hover:text-blue-600">Search</Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">Booking</span>
                </nav>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-20 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5" /> Passenger Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                            <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                            <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="mt-6 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Continue to Insurance</button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5" /> Select Insurance
                                    </h2>
                                    <div className="space-y-4">
                                        {/* No Insurance Option */}
                                        <div
                                            onClick={() => setSelectedInsuranceId("none")}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedInsuranceId === "none" ? 'border-gray-600 bg-gray-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">No Insurance</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Continue without delay protection</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-500">$0</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Insurance Plans */}
                                        {plans?.map((plan) => (
                                            <div key={plan.id} onClick={() => setSelectedInsuranceId(plan.id)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedInsuranceId === plan.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'} ${plan.recommended ? 'ring-2 ring-blue-400' : ''}`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                                            {plan.recommended && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Recommended</span>}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">Coverage: {plan.coverage_percentage}% of ticket price</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{plan.delay || "Delay protection"}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-blue-600">${plan.price}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button type="button" onClick={() => setStep(1)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">Back</button>
                                        <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Continue to Payment</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" /> Payment Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                                            <input type="text" value={formData.cardNumber} onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    value={formData.expiryDate}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                                                        if (value.length >= 2) {
                                                            value = value.slice(0, 2) + '/' + value.slice(2, 4); // Add slash
                                                        }
                                                        setFormData({ ...formData, expiryDate: value });
                                                    }}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                                                <input type="text" value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} placeholder="123" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                                            </div>
                                        </div>
                                    </div>
                                    {paymentError && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            {paymentError}
                                        </div>
                                    )}
                                    <div className="flex gap-4 mt-6">
                                        <button type="button" onClick={() => setStep(2)} className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700">Back</button>
                                        <button type="submit" disabled={isBookingPending} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isBookingPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Complete Booking
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Flight</span>
                                    <span className="font-medium text-gray-900 dark:text-white">FL{flight.flightId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Route</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{flight.origin} → {flight.destination}</span>
                                </div>
                                <hr className="border-gray-200 dark:border-gray-700" />
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Base Fare</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${basePrice}</span>
                                </div>
                                {selectedPlan && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Insurance ({selectedPlan.name})</span>
                                        <span className="font-medium text-gray-900 dark:text-white">${insurancePrice}</span>
                                    </div>
                                )}
                                <hr className="border-gray-200 dark:border-gray-700" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-blue-600">${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
