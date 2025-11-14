import { CoverageDataSchema } from "@/types/coverage"

export function getCenterLocation(locations: CoverageDataSchema[]): [number, number] {
  if (!locations?.length) return [0, 0]

  const total = locations?.reduce(
    (acc, loc) => {
      acc.lat += loc.latitude
      acc.lng += loc.longitude
      return acc
    },
    { lat: 0, lng: 0 }
  )

  return [total.lat / locations.length, total.lng / locations.length,]
}