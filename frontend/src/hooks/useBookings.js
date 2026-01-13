import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

async function createBooking(data, userId) {
    // Extract numeric flight ID (handles both "FL123" and "123" formats)
    let flightId = data.flight_id;
    if (typeof flightId === 'string') {
        flightId = parseInt(flightId.replace(/\D/g, ''), 10);
    }

    // Determine if insurance is selected and get the plan ID
    const hasInsurance = !!data.insurance_plan_id && data.insurance_plan_id !== "none";

    // Transform frontend data to backend format
    const requestData = {
        user_id: userId, // Use the authenticated user's ID
        flight_id: flightId,
        with_insurance: hasInsurance,
        insurance_plan_id: hasInsurance ? data.insurance_plan_id : null,
    };

    console.log("Creating booking with data:", requestData);
    const response = await api.post("/bookings/", requestData);
    return response.data;
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const userId = user?.id || 1; // Fallback to 1 for demo

    return useMutation({
        mutationFn: (data) => createBooking(data, userId),
        onSuccess: () => {
            // Invalidate related queries (include userId in query key)
            queryClient.invalidateQueries({ queryKey: ["my-policies"] });
            queryClient.invalidateQueries({ queryKey: ["my-transactions"] });
            // Navigate to dashboard
            router.push("/dashboard");
        },
        onError: (error) => {
            console.error("Booking failed:", error);
        },
    });
}
