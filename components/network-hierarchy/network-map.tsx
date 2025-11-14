"use client"

import { OLT } from "@/types/networks"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>,
})

interface NetworkMapProps {
  olts: OLT[]
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
}

export default function NetworkMap({ olts, selectedItem, onSelectItem }: NetworkMapProps) {
  const [markers, setMarkers] = useState<any[]>([])

  console.log(olts)

  useEffect(() => {
    const newMarkers: any[] = []

    // Extract all locations from the hierarchy
    olts.forEach((olt) => {
      if (olt.latitude && olt.longitude) {
        newMarkers.push({
          id: olt.id,
          type: "OLT",
          name: olt.name,
          lat: olt.latitude,
          lng: olt.longitude,
          color: "blue",
          model: olt.model,
          brand: olt.brand,
          ipAddress: olt.ipAddress,
          lcpCount: olt.ponPorts?.reduce((count, p) => count + (p.lcps?.length || 0), 0),
          ponCount: olt.ponCount
        })
      }

      olt.ponPorts?.forEach((ponPort) => {
        ponPort.lcps?.forEach((lcp) => {
          if (lcp.latitude && lcp.longitude) {
            newMarkers.push({
              id: lcp.id,
              type: "LCP",
              name: lcp.lcpCode,
              lat: lcp.latitude,
              lng: lcp.longitude,
              color: "green",
              odcCount: lcp.odcs?.length || 0,
            })
          }

          lcp.odcs?.forEach((odc) => {
            if (odc.latitude && odc.longitude) {
              newMarkers.push({
                id: odc.id,
                type: "ODC",
                name: odc.name,
                lat: odc.latitude,
                lng: odc.longitude,
                color: "orange",
                cabinetCode: odc.cabinetCode,
                odpCount: odc.odps?.length || 0,
              })
            }

            odc.odps?.forEach((odp) => {
              if (odp.latitude && odp.longitude) {
                newMarkers.push({
                  id: odp.id,
                  type: "ODP",
                  name: odp.name,
                  lat: odp.latitude,
                  lng: odp.longitude,
                  color: "red",
                  odpCode: odp.odpCode,
                  totalPorts: odp.ports?.length || 0,
                })
              }
            })
          })
        })
      })
    })

    setMarkers(newMarkers)
  }, [olts])

  return <MapComponent markers={markers} selectedItem={selectedItem} onSelectItem={onSelectItem} />
}
