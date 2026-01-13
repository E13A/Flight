import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Transform backend response to include UI-friendly fields
function transformFlight(raw) {
    return {
        ...raw,
        id: String(raw.flightId),
        flight_number: `FL${raw.flightId}`,
        airline: "Global Air", // Default placeholder
        price: raw.price || 250, // Default price
        base_price: raw.base_price || 250,
    };
}

async function fetchFlights(params) {
    const { data } = await api.get("/flights/", { params });
    return data.map(transformFlight);
}

export function useFlights(params) {
    return useQuery({
        queryKey: ["flights", params],
        queryFn: () => fetchFlights(params),
        // Always fetch - remove restrictive condition to show all flights by default
    });
}
