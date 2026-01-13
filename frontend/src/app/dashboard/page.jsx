"use client";

import { useState } from "react";
import {
    Plane,
    Shield,
    DollarSign,
    CheckCircle,
    TrendingUp,
    X,
    ExternalLink,
    Clock,
    MapPin,
    Calendar,
    CreditCard,
    User,
    Ticket,
    ArrowRight,
} from "lucide-react";
import { useMyPolicies, useMyTransactions } from "@/hooks/usePolicies";

// Dummy data removed - using API hooks

function PolicyDetailModal({ policy, onClose }) {
    if (!policy) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Booking & Policy Details
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Booking #{policy.booking_id} • Policy #{policy.id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${policy.status === "ACTIVE"
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {policy.status || "UNKNOWN"}
                            </span>
                            {policy.is_premium_seat && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                                    ✨ Premium Seat
                                </span>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Booked on: {policy.booking_date || "N/A"}
                        </span>
                    </div>

                    {/* Flight Route Visual */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{policy.origin || "DEP"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{policy.departure_time_formatted || "N/A"}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{policy.departure_date || ""}</p>
                            </div>
                            <div className="flex-1 px-6">
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                                    <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400 transform rotate-90" />
                                    <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                                </div>
                                <p className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                                    {policy.flight_duration || "N/A"}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">{policy.destination || "ARR"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{policy.arrival_time_formatted || "N/A"}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{policy.arrival_date || ""}</p>
                            </div>
                        </div>
                    </div>

                    {/* Flight Details */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Plane className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            Flight Information
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Flight Number</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.flight_id}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Airline</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.airline || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Seat Number</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.seat_number || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Duration</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.flight_duration || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                            Payment Breakdown
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-700 dark:text-gray-300">Ticket Price</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">${policy.ticket_price || "0.00"}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-700 dark:text-gray-300">Insurance Premium</span>
                                </div>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">${policy.premium_paid || "0.00"}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 -mx-3">
                                <span className="font-semibold text-gray-900 dark:text-white">Total Amount Paid</span>
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">${policy.total_paid || "0.00"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Coverage */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                            Insurance Coverage
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Max Coverage Limit</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${policy.coverage_amount}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Max payout on delay</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Premium Paid</p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${policy.premium_paid}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Insurance cost</p>
                            </div>
                        </div>
                    </div>

                    {/* Passenger Info */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Passenger Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Name</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.passenger || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{policy.phone || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Blockchain Info */}
                    {policy.contract_address && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                🔗 Blockchain Information
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Smart Contract</span>
                                    <a
                                        href="#"
                                        className="font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        {policy.contract_address}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">Network</span>
                                    <span className="font-medium text-gray-900 dark:text-white">Ethereum Sepolia</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


function TransactionDetailModal({ transaction, onClose }) {
    if (!transaction) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Transaction Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Transaction Overview */}
                    <div
                        className={`rounded-xl p-4 ${transaction.type === "payout"
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className={`px-3 py-1 rounded text-sm font-medium ${transaction.type === "payout"
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                    }`}
                            >
                                {transaction.type.toUpperCase()}
                            </span>
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                Amount
                            </p>
                            <p
                                className={`text-4xl font-bold ${transaction.amount > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-gray-900 dark:text-white"
                                    }`}
                            >
                                {transaction.amount > 0 ? "+" : ""}$
                                {Math.abs(transaction.amount)}
                            </p>
                        </div>
                    </div>

                    {/* Transaction Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Transaction Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Transaction ID
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Related Policy
                                </p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.policyId}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Flight</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.flight} ({transaction.route})
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Date</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.date}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Status</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">
                                    Completed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payout Details (for payout transactions) */}
                    {transaction.type === "payout" && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Payout Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Delay Reason
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {transaction.delayReason}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Actual Delay
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {transaction.actualDelay}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Payout Calculation
                                    </p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {transaction.payoutCalculation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Details (for premium transactions) */}
                    {transaction.type === "premium" && (
                        <div className="space-y-4">
                            {/* Flight Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-blue-600" />
                                    Flight Details
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Route</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{transaction.route}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Departure</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{transaction.departure_time || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Arrival</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{transaction.arrival_time || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Duration</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{transaction.flight_duration || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 dark:text-gray-400">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{transaction.departure_date || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-green-600" />
                                    Payment Breakdown
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300">Ticket Price</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">${transaction.ticket_price || "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-500" />
                                            <span className="text-gray-700 dark:text-gray-300">Insurance Premium</span>
                                        </div>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">${transaction.insurance_price || "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 -mx-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">Total Paid</span>
                                        <span className="text-xl font-bold text-green-600 dark:text-green-400">${transaction.total_amount || Math.abs(transaction.amount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">{transaction.paymentMethod || "Credit Card"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Blockchain Information */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Blockchain Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Network</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.blockchainNetwork}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Transaction Hash
                                </p>
                                <a
                                    href="#"
                                    className="font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 break-all"
                                >
                                    {transaction.txHash}
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-400">Gas Used</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.gasUsed}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("policies");
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    // API Integration
    const { data: policies, isLoading: isLoadingPolicies, error: policiesError } = useMyPolicies();
    const { data: transactions, isLoading: isLoadingTransactions, error: transactionsError } = useMyTransactions();

    // Calculate dynamic stats from real data
    const activePoliciesCount = policies?.filter(p => p.status === "ACTIVE").length || 0;
    const totalCoverage = policies?.reduce((sum, p) => sum + parseFloat(p.coverage_amount || 0), 0) || 0;
    const payoutsReceived = transactions?.filter(t => t.type === "payout").reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0) || 0;
    const totalTransactions = transactions?.length || 0;
    const successfulTransactions = transactions?.filter(t => t.status?.toLowerCase() === "completed" || t.status?.toLowerCase() === "approved").length || 0;
    const successRate = totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 100;

    const stats = [
        {
            label: "Active Policies",
            value: isLoadingPolicies ? "..." : String(activePoliciesCount),
            icon: Shield,
            color: "blue",
        },
        {
            label: "Total Coverage",
            value: isLoadingPolicies ? "..." : `$${totalCoverage.toFixed(0)}`,
            icon: DollarSign,
            color: "green",
        },
        {
            label: "Payouts Received",
            value: isLoadingTransactions ? "..." : `$${payoutsReceived.toFixed(0)}`,
            icon: TrendingUp,
            color: "purple",
        },
        {
            label: "Success Rate",
            value: isLoadingTransactions ? "..." : `${successRate}%`,
            icon: CheckCircle,
            color: "green",
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your policies and view transaction history
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}
                                    >
                                        <Icon
                                            className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                                        />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tab Navigation */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex">
                            <button
                                onClick={() => setActiveTab("policies")}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "policies"
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                My Policies
                            </button>
                            <button
                                onClick={() => setActiveTab("transactions")}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "transactions"
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Transactions
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Policies Tab */}
                        {activeTab === "policies" && (
                            <div className="space-y-4">
                                {isLoadingPolicies ? (
                                    <div className="text-center py-8 text-gray-500">Loading policies...</div>
                                ) : policiesError ? (
                                    <div className="text-center py-8 text-red-500">Error loading policies</div>
                                ) : policies && policies.length > 0 ? (
                                    policies.map((policy) => (
                                        <div
                                            key={policy.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                    <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        {policy.flight_id}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        {policy.route || "Route N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        Benefit: Max ${policy.coverage_amount}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${policy.status === "ACTIVE"
                                                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                                        }`}
                                                >
                                                    {policy.status}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setSelectedPolicy(policy)
                                                    }
                                                    className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No policies found.</div>
                                )}
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === "transactions" && (
                            <div className="overflow-x-auto">
                                {isLoadingTransactions ? (
                                    <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                                ) : transactionsError ? (
                                    <div className="text-center py-8 text-red-500">Error loading transactions</div>
                                ) : transactions && transactions.length > 0 ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Type
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Flight
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Amount
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Date
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Status
                                                </th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    TX Hash
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((tx) => (
                                                <tr
                                                    key={tx.id}
                                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${tx.type === "payout"
                                                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                                                : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                                                }`}
                                                        >
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                                                        {tx.flight}
                                                    </td>
                                                    <td
                                                        className={`py-3 px-4 font-semibold ${tx.amount > 0
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-900 dark:text-white"
                                                            }`}
                                                    >
                                                        {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                                        {tx.date || "N/A"}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <button
                                                            onClick={() =>
                                                                setSelectedTransaction(tx)
                                                            }
                                                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">No transactions found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {selectedPolicy && (
                <PolicyDetailModal
                    policy={selectedPolicy}
                    onClose={() => setSelectedPolicy(null)}
                />
            )}
            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </main>
    );
}

