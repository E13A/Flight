import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

// In a real app, plans might be fetched from backend or constants.
// For now, we export the dynamic plans function or constants here.
export const POLICY_PLANS = [
    {
        id: "basic",
        name: "Basic Protection",
        price: 15,
        coverage: 100,
        features: [
            "Delays over 3 hours",
            "Up to $100 payout",
            "Automatic processing",
        ],
    },
    {
        id: "standard",
        name: "Standard Protection",
        price: 25,
        coverage: 250,
        features: [
            "Delays over 2 hours",
            "Up to $250 payout",
            "Automatic processing",
            "Cancellation coverage",
        ],
        recommended: true,
    },
    {
        id: "premium",
        name: "Premium Protection",
        price: 45,
        coverage: 500,
        features: [
            "Delays over 1 hour",
            "Up to $500 payout",
            "Automatic processing",
            "Cancellation coverage",
            "Baggage protection",
        ],
    },
];

async function fetchMyPolicies(userId) {
    console.log("Fetching policies from backend for user:", userId);
    const { data } = await api.get(`/policies/mine?user_id=${userId}`);
    console.log("Policies received:", data);
    return data;
}

export function useMyPolicies() {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id || 1; // Fallback to 1 for demo

    return useQuery({
        queryKey: ["my-policies", userId],
        queryFn: () => fetchMyPolicies(userId),
        staleTime: 0, // Always consider data stale
        refetchOnMount: "always", // Always refetch when component mounts
        refetchOnWindowFocus: true,
        enabled: isAuthenticated || true, // Allow even without auth for demo
    });
}

// Optional: Hook for purchasing
export function usePurchasePolicy() {
    // const queryClient = useQueryClient();
    // return useMutation({
    //   mutationFn: (data) => api.post("/policies/purchase", data),
    //   onSuccess: () => {
    //     queryClient.invalidateQueries({ queryKey: ["my-policies"] });
    //   },
    // });
}

async function fetchMyTransactions(userId) {
    console.log("Fetching transactions from backend for user:", userId);
    const { data } = await api.get(`/policies/transactions?user_id=${userId}`);
    console.log("Transactions received:", data);
    return data;
}

export function useMyTransactions() {
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id || 1; // Fallback to 1 for demo

    return useQuery({
        queryKey: ["my-transactions", userId],
        queryFn: () => fetchMyTransactions(userId),
        staleTime: 0, // Always consider data stale
        refetchOnMount: "always", // Always refetch when component mounts
        refetchOnWindowFocus: true,
        enabled: isAuthenticated || true, // Allow even without auth for demo
    });
}

async function fetchPolicyPlans() {
    const { data } = await api.get("/policies/plans");
    return data;
}

export function usePolicyPlans() {
    return useQuery({
        queryKey: ["policy-plans"],
        queryFn: fetchPolicyPlans,
        staleTime: 1000 * 60 * 10, // Plans don't change often, cache for 10 minutes
    });
}
