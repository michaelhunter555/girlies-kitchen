import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calcDeliveryFeeFromMiles,
  KITCHEN_ORIGIN,
} from "@/lib/constants";
import {
  getDrivingDistanceMiles,
  getPlaceCoords,
} from "@/lib/google-maps";

const bodySchema = z.object({
  placeId: z.string().min(3),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    const place = await getPlaceCoords(parsed.data.placeId);
    const distance = await getDrivingDistanceMiles(
      { lat: KITCHEN_ORIGIN.lat, lng: KITCHEN_ORIGIN.lng },
      { lat: place.lat, lng: place.lng }
    );
    const quote = calcDeliveryFeeFromMiles(distance.miles);

    return NextResponse.json({
      placeId: place.placeId,
      formattedAddress: place.formattedAddress,
      lat: place.lat,
      lng: place.lng,
      miles: distance.miles,
      distanceText: distance.distanceText,
      durationText: distance.durationText,
      ratePerMile: 2,
      fee: quote.fee,
      allowed: quote.allowed,
      reason: quote.reason,
      origin: KITCHEN_ORIGIN.label,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery quote failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
