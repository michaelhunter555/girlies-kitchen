import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export function getGoogleApiKey() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error("GOOGLE_API_KEY is not set");
  }
  return key;
}

export type PlacePrediction = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
};

export type PlaceCoords = {
  placeId: string;
  formattedAddress: string;
  lat: number;
  lng: number;
};

export async function autocompletePlaces(
  input: string,
  sessionToken?: string
): Promise<PlacePrediction[]> {
  const key = getGoogleApiKey();
  const trimmed = input.trim();
  if (trimmed.length < 3) return [];

  const lat = Number(process.env.KITCHEN_LAT ?? 39.4757);
  const lng = Number(process.env.KITCHEN_LNG ?? -76.2441);

  const params = new URLSearchParams({
    input: trimmed,
    key,
    components: "country:us",
    location: `${lat},${lng}`,
    radius: "50000",
  });
  if (sessionToken) params.set("sessiontoken", sessionToken);

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
  );
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    predictions?: Array<{
      place_id: string;
      description: string;
      structured_formatting?: {
        main_text?: string;
        secondary_text?: string;
      };
    }>;
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      data.error_message || `Places autocomplete failed: ${data.status}`
    );
  }

  return (data.predictions ?? []).map((prediction) => ({
    placeId: prediction.place_id,
    description: prediction.description,
    mainText:
      prediction.structured_formatting?.main_text || prediction.description,
    secondaryText: prediction.structured_formatting?.secondary_text || "",
  }));
}

export async function getPlaceCoords(placeId: string): Promise<PlaceCoords> {
  const key = getGoogleApiKey();
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "place_id,formatted_address,geometry",
    key,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
  );
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    result?: {
      place_id?: string;
      formatted_address?: string;
      geometry?: { location?: { lat?: number; lng?: number } };
    };
  };

  if (data.status !== "OK" || !data.result) {
    throw new Error(
      data.error_message || `Place details failed: ${data.status}`
    );
  }

  const lat = data.result.geometry?.location?.lat;
  const lng = data.result.geometry?.location?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Selected place has no coordinates");
  }

  return {
    placeId: data.result.place_id || placeId,
    formattedAddress: data.result.formatted_address || "",
    lat,
    lng,
  };
}

export async function getDrivingDistanceMiles(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) {
  const key = getGoogleApiKey();
  const params = new URLSearchParams({
    origins: `${origin.lat},${origin.lng}`,
    destinations: `${destination.lat},${destination.lng}`,
    units: "imperial",
    mode: "driving",
    key,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`
  );
  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    rows?: Array<{
      elements?: Array<{
        status: string;
        distance?: { value: number; text: string };
        duration?: { text: string };
      }>;
    }>;
  };

  if (data.status !== "OK") {
    throw new Error(
      data.error_message || `Distance Matrix failed: ${data.status}`
    );
  }

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK" || !element.distance) {
    throw new Error(
      element?.status === "ZERO_RESULTS"
        ? "No driving route found for that address"
        : "Could not calculate delivery distance"
    );
  }

  const meters = element.distance.value;
  const miles = meters / 1609.344;
  return {
    miles: Math.round(miles * 10) / 10,
    distanceText: element.distance.text,
    durationText: element.duration?.text || "",
  };
}
