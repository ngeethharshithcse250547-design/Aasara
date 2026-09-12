/**
 * Static state/UT capital coordinates for geo-spatial partner mapping.
 *
 * These are public geographic data points (capital city coordinates),
 * NOT fabricated partner office locations. Pins on the map represent
 * the general state headquarters area where partners operate.
 *
 * Source: public geographic data (capital city lat/lng).
 */

export interface StateCoordinate {
  lat: number;
  lng: number;
  capital: string;
}

/**
 * Lookup keyed by state name exactly as it appears in the partner dataset.
 */
export const STATE_COORDINATES: Record<string, StateCoordinate> = {
  "Andhra Pradesh": { lat: 16.5062, lng: 80.6480, capital: "Vijayawada" },
  "Assam": { lat: 26.1445, lng: 91.7362, capital: "Guwahati" },
  "Bihar": { lat: 25.6093, lng: 85.1376, capital: "Patna" },
  "Chandigarh": { lat: 30.7333, lng: 76.7794, capital: "Chandigarh" },
  "Chhattisgarh": { lat: 21.2514, lng: 81.6296, capital: "Raipur" },
  "Dadra & Nagar Haveli, Daman & Diu": { lat: 20.1809, lng: 73.0169, capital: "Daman" },
  "Delhi": { lat: 28.6139, lng: 77.2090, capital: "New Delhi" },
  "Goa": { lat: 15.4909, lng: 73.8278, capital: "Panaji" },
  "Gujarat": { lat: 23.2156, lng: 72.6369, capital: "Gandhinagar" },
  "Haryana": { lat: 30.7333, lng: 76.7794, capital: "Chandigarh" },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, capital: "Shimla" },
  "Jammu & Kashmir": { lat: 34.0837, lng: 74.7973, capital: "Srinagar" },
  "Jharkhand": { lat: 23.3441, lng: 85.3096, capital: "Ranchi" },
  "Karnataka": { lat: 12.9716, lng: 77.5946, capital: "Bengaluru" },
  "Kerala": { lat: 8.5241, lng: 76.9366, capital: "Thiruvananthapuram" },
  "Madhya Pradesh": { lat: 23.2599, lng: 77.4126, capital: "Bhopal" },
  "Maharashtra": { lat: 19.0760, lng: 72.8777, capital: "Mumbai" },
  "Manipur": { lat: 24.8170, lng: 93.9368, capital: "Imphal" },
  "Meghalaya": { lat: 25.5788, lng: 91.8933, capital: "Shillong" },
  "Mizoram": { lat: 23.7271, lng: 92.7176, capital: "Aizawl" },
  "Odisha": { lat: 20.2961, lng: 85.8245, capital: "Bhubaneswar" },
  "Puducherry": { lat: 11.9416, lng: 79.8083, capital: "Puducherry" },
  "Punjab": { lat: 30.7333, lng: 76.7794, capital: "Chandigarh" },
  "Rajasthan": { lat: 26.9124, lng: 75.7873, capital: "Jaipur" },
  "Sikkim": { lat: 27.3389, lng: 88.6065, capital: "Gangtok" },
  "Tamil Nadu": { lat: 13.0827, lng: 80.2707, capital: "Chennai" },
  "Telangana": { lat: 17.3850, lng: 78.4867, capital: "Hyderabad" },
  "Tripura": { lat: 23.8315, lng: 91.2868, capital: "Agartala" },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462, capital: "Lucknow" },
  "Uttarakhand": { lat: 30.3165, lng: 78.0322, capital: "Dehradun" },
  "West Bengal": { lat: 22.5726, lng: 88.3639, capital: "Kolkata" },
};

/**
 * Default map center (geographic center of India).
 */
export const INDIA_CENTER: { lat: number; lng: number } = {
  lat: 22.5,
  lng: 82.0,
};

/**
 * Default map zoom for India overview.
 */
export const INDIA_DEFAULT_ZOOM = 4.2;

/**
 * Haversine distance in km between two lat/lng points.
 */
export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the nearest state to a given lat/lng.
 * Returns the state name and distance in km.
 */
export function findNearestState(
  lat: number,
  lng: number
): { state: string; distanceKm: number; coordinate: StateCoordinate } | null {
  let nearest: { state: string; distanceKm: number; coordinate: StateCoordinate } | null = null;

  for (const [state, coord] of Object.entries(STATE_COORDINATES)) {
    const d = haversineDistanceKm(lat, lng, coord.lat, coord.lng);
    if (!nearest || d < nearest.distanceKm) {
      nearest = { state, distanceKm: d, coordinate: coord };
    }
  }

  return nearest;
}
