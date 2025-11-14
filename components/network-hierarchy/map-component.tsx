"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {
  Server,          // OLT
  Network,         // LCP
  Cable,           // ODC
  Plug,            // ODP
} from "lucide-react"
import { renderToStaticMarkup } from "react-dom/server"

interface Marker {
  id: string
  type: string
  name: string
  lat: number
  lng: number
  color: string
  model?: string,
  brand?: string,
  ipAddress?: string
  lcpCount?: number
  ponCount?: number
  odcCount?: number
  odpCount?: number
  totalPorts?: number
  cabinetCode?: string
  odpCode?: string
}

interface MapComponentProps {
  markers: Marker[]
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
}

const colorMap: Record<string, string> = {
  blue: "#3B82F6",
  green: "#10B981",
  orange: "#F97316",
  red: "#EF4444",
  gray: "#6B7280",
}

// ✅ Generate the icon using real Lucide React components
function getLucideIcon(type: string, color: string) {
  const commonProps = { color, size: 22, strokeWidth: 2 }

  switch (type.toUpperCase()) {
    case "OLT":
      return renderToStaticMarkup(<Server {...commonProps} />)
    case "LCP":
      return renderToStaticMarkup(<Network {...commonProps} />)
    case "ODC":
      return renderToStaticMarkup(<Cable {...commonProps} />)
    case "ODP":
      return renderToStaticMarkup(<Plug {...commonProps} />)
    default:
      return `<div style="width:12px;height:12px;background:${color};border-radius:50%;"></div>`
  }
}

function getIconHTML(type: string, color: string, isSelected: boolean): string {
  const svg = getLucideIcon(type, color)
  return `
    <div style="
      background: #fff;
      border: ${isSelected? "3px": "2px"} solid ${isSelected ? "red" : color};
      border-radius: 8px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 4px rgba(0,0,0,0.25);
    ">
      ${svg}
    </div>
  `
}

export default function MapComponent({ markers, selectedItem, onSelectItem }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("network-map", { zoomControl: true })

      // --- Define multiple tile layers ---
      const baseLayers = {
        "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }),

        "Esri Satellite": L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution: "Tiles © Esri & the GIS User Community",
          }
        ),

        "Google Satellite": L.tileLayer(
          "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          {
            attribution: "© Google",
            maxZoom: 20,
          }
        ),

        "Google Hybrid": L.tileLayer(
          "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
          {
            attribution: "© Google",
            maxZoom: 20,
          }
        ),


      }

      // Default tile layer
      baseLayers["OpenStreetMap"].addTo(map)

      // Add layer control to switch tiles
      L.control.layers(baseLayers).addTo(map)

      mapRef.current = map
    }

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove())
    markersRef.current = {}

    const latLngs: L.LatLngExpression[] = []

    markers.forEach((marker) => {
      const color = colorMap[marker.color] || colorMap.gray
      const isSelected = selectedItem?.id === marker.id

      const icon = L.divIcon({
        className: "custom-lucide-icon",
        html: getIconHTML(marker.type, color, isSelected),
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const popupContent = `
        <div style="font-size:14px; line-height:1.4">
          <strong style="font-size:16px; color:${color};">${marker.type}</strong><br/>
          <span><b>Name:</b> ${marker.name}</span><br/>
          <span><b>Latitude:</b> ${marker.lat.toFixed(6)}</span><br/>
          <span><b>Longitude:</b> ${marker.lng.toFixed(6)}</span><br/>
          ${
            marker.type === "OLT"
              ? "<span><b>Model:</b> " + (marker.model ?? "N/A") + "</span><br/><span><b>Brand:</b> " + (marker.brand ?? "N/A") + "</span><br/><span><b>Ip:</b> " + (marker.ipAddress ?? "N/A") + "</span><br/><span><b>Pon Count:</b> " + (marker.ponCount ?? "N/A") + "</span><br/><span><b>Connected LCPs:</b> " + (marker.lcpCount ?? "N/A") + "</span><br/>"
              : marker.type === "LCP"
              ? "<span><b>Connected ODCs:</b> " + (marker.odcCount ?? "N/A") + "</span><br/>"
              : marker.type === "ODC"
              ? "<span><b>ODC Code:</b> " + (marker.cabinetCode ?? "N/A") + "</span><br/><span><b>Connected ODPs:</b> " + (marker.odpCount ?? "N/A") + "</span><br/>"
              : marker.type === "ODP"
              ? "<span><b>ODP Code:</b> " + (marker.odpCode ?? "N/A") + "</span><br/><span><b>Total Ports:</b> " + (marker.totalPorts ?? "N/A") + "</span><br/>"
              : ""
          }
        </div>
      `

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .bindPopup(popupContent)
        .on("click", () => {})
        .addTo(mapRef.current!)


      markersRef.current[marker.id] = leafletMarker
      latLngs.push([marker.lat, marker.lng])
    })

    // Fit to markers
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs)
      mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [markers, selectedItem, onSelectItem])

  return (
    <div
      id="network-map"
      className="w-full h-full z-50"
      style={{ minHeight: "500px", borderRadius: "8px", overflow: "hidden" }}
    />
  )
}
