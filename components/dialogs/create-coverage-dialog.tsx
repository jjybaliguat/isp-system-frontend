"use client"

import 'leaflet/dist/leaflet.css'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { CoverageDataSchema } from '@/types/coverage'
import { useCreateCoverageMutation, useUpdateCoverageMutation } from '@/redux/fetures/converage-api-slice'
import L from 'leaflet'

const customIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [80, 40],
  shadowAnchor: [20, 40]
});

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing?: boolean
  coverage?: CoverageDataSchema
}

const CoverageDialog = ({ open, onOpenChange, isEditing = false, coverage }: DialogProps) => {
  const markerRef = useRef<any>(null)
  const animateRef = useRef(false)

  const [createCoverage, { isLoading: creating }] = useCreateCoverageMutation()
  const [updateCoverage, { isLoading: updating }] = useUpdateCoverageMutation()

  const [position, setPosition] = useState<[number, number]>([0, 0])
  const [formData, setFormData] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    radius: 200,
  })

  function handleResetForm(){
    setFormData({
      name: '',
      latitude: 0,
      longitude: 0,
      radius: 200,
    })
  }

  // Initialize form for editing
  useEffect(() => {
    if (open) {
      if (isEditing && coverage) {
        setFormData({
          name: coverage.name,
          latitude: coverage.latitude,
          longitude: coverage.longitude,
          radius: coverage.radius,
        })
        setPosition([coverage.latitude, coverage.longitude])
      } else {
        // Get current location for create mode
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude])
            setFormData((prev) => ({
              ...prev,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }))
          },
          (error) => console.error("Geolocation error:", error),
          { enableHighAccuracy: true }
        )
      }
    }
  }, [open, isEditing, coverage])

  // Update form when marker moves
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker) {
          const { lat, lng } = marker.getLatLng()
          setPosition([lat, lng])
          setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
        }
      },
    }),
    []
  )

  // Keep position synced
  useEffect(() => {
    setPosition([formData.latitude, formData.longitude])
  }, [formData.latitude, formData.longitude])

  function MapUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
    const map = useMap()
    useEffect(() => {
      if (!isNaN(latitude) && !isNaN(longitude)) {
        map.flyTo([latitude, longitude])
      }
    }, [latitude, longitude, map])
    return null
  }

  function SetViewOnClick({ animateRef }: any) {
    const map = useMapEvent('click', (e) => {
      map.setView(e.latlng, map.getZoom(), {
        animate: (animateRef.current = !animateRef.current),
      })
      setPosition([e.latlng.lat, e.latlng.lng])
      setFormData((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }))
    })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing && coverage) {
        await updateCoverage({ id: coverage.id, data: formData }).unwrap()
        toast("Success", { description: "Coverage updated successfully" })
      } else {
        await createCoverage(formData).unwrap()
        toast("Success", { description: "Coverage added successfully" })
      }

      onOpenChange(false)
      setFormData({ name: '', latitude: 0, longitude: 0, radius: 200 })
    } catch (error: any) {
      console.error(error)
      toast("Error", { description: error?.data?.message || "Something went wrong" })
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(state) => {
        onOpenChange(state)
        if (!state) handleResetForm()
      }}
  >
      <DialogContent
            className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[600px] 
            p-4 sm:p-6 rounded-xl"
        >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Coverage Area" : "Create Coverage Area"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this coverage's details" : "Group your clients by coverage"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Coverage name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-2 flex-1">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                placeholder="Enter latitude"
                value={formData.latitude}
                type="number"
                step="any"
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="long">Longitude</Label>
              <Input
                id="long"
                placeholder="Enter longitude"
                value={formData.longitude}
                type="number"
                step="any"
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Radius</Label>
            <Input
              id="radius"
              placeholder="Enter radius"
              type="number"
              min={200}
              step="any"
              value={formData.radius}
              onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Select Area (move the marker)</Label>
            <div id="location" className="h-[400px] w-full">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full rounded-md z-0"
              >
                <SetViewOnClick animateRef={animateRef} />
                <MapUpdater latitude={formData.latitude} longitude={formData.longitude} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker draggable eventHandlers={eventHandlers} ref={markerRef} position={position} icon={customIcon}>
                  <Popup minWidth={90}>
                    <span>Marker is draggable</span>
                  </Popup>
                </Marker>
                <Circle
                  className="animate-pulse"
                  center={position}
                  pathOptions={{ fillColor: 'blue' }}
                  radius={formData.radius}
                />
              </MapContainer>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={creating || updating}>
              {creating || updating
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CoverageDialog
