import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Transform function similar to useFlights to ensure consistent data structure
function transformFlight(raw) {
    return {
        ...raw,
        id: String(raw.flightId || raw.id),
        flight_number: raw.flight_number || `FL${raw.flightId || raw.id}`,
        airline: raw.airline || "Global Air",
        price: raw.price || 250, // Ensure fallback price matches other views
        base_price: raw.base_price || 250,
        origin: raw.origin || "DEP",
        destination: raw.destination || "ARR",
    };
}

async function fetchFlight(id) {
    // Check if ID starts with FL to strip it, though backend expects int
    // Frontend logic often uses prefixes in UI but cleaner numeric IDs in API
    const numericId = id.replace(/\D/g, '');
    const { data } = await api.get(`/flights/${numericId}`);
    return transformFlight(data); // Apply transformation
}

export function useFlight(id) {
    return useQuery({
        queryKey: ["flight", id],
        queryFn: () => fetchFlight(id),
        enabled: !!id,
    });
}
