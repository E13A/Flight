"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingUp, Users, Activity } from "lucide-react";

const SimpleBarChart = ({ data, color = "blue" }) => {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between h-64 gap-2 px-4 py-4 w-full">
            {data.map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                    {/* Tooltip-like value */}
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {value}
                    </span>
                    <div
                        className={`w-full bg-${color}-500 rounded-t-sm transition-all duration-500 hover:bg-${color}-600`}
                        style={{ height: `${(value / max) * 100}%` }}
                    />
                </div>
            ))}
        </div>
    );
};

export default function AdminPage() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">System performance and contract monitoring.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Oracle Lag: 12ms</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Premium</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">45.2 ETH</h3>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Policies</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1,240</h3>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Users</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">892</h3>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Claim Ratio</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4.2%</h3>
                            </div>
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts with Simple Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-100 dark:border-slate-800">
                        <SimpleBarChart data={[40, 70, 50, 90, 60, 80, 100, 120, 85, 95, 110, 130]} color="green" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Flight Delays by Airline</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-b-xl border-t border-slate-100 dark:border-slate-800">
                        <SimpleBarChart data={[12, 19, 3, 5, 2, 8, 15]} color="red" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

