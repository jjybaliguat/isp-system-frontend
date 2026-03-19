"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useGetPPPHistoryQuery } from "@/redux/fetures/mikrotik-api-slice"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const intervalOptions = [1, 2, 5, 10, 30, 60]

const roundToInterval = (date: Date, seconds: number) => {
  const ms = seconds * 1000
  return new Date(Math.floor(date.getTime() / ms) * ms)
}

const getDayBounds = (date: Date) => {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

export default function PPPGraphPage() {
  const router = useRouter()
  const { username } = useParams()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mode, setMode] = useState<"realtime" | "historical">("realtime")
  const [intervalSec, setIntervalSec] = useState(2)
  const [debouncedInterval, setDebouncedInterval] = useState(2)
    // 🔥 ZOOM (fixed: respects selected date)
  const zoomLevels = [
    { label: "5m", seconds: 2, windowMs: 5 * 60 * 1000 },
    { label: "30m", seconds: 10, windowMs: 30 * 60 * 1000 },
    { label: "1h", seconds: 10, windowMs: 60 * 60 * 1000 },
    { label: "6h", seconds: 30, windowMs: 6 * 60 * 60 * 1000 },
    { label: "1d", seconds: 60, windowMs: 24 * 60 * 60 * 1000 },
  ]
  const [selectedZoomLevel, setSelectedZoomLevel] = useState("5m")

  const [viewport, setViewport] = useState(() => {
    const now = new Date()
    return {
      from: new Date(now.getTime() - 5 * 60 * 1000),
      to: now,
    }
  })

  // 🔥 Derived values (clean)
  const { start, end } = useMemo(() => getDayBounds(selectedDate), [selectedDate])
  const now = new Date()
  const isToday = start.toDateString() === now.toDateString()
  const maxEnd = isToday ? now : end
  const isAtEnd = viewport.to.getTime() >= maxEnd.getTime()

  // 🔥 Reset viewport on date change
  useEffect(() => {
    const to = isToday ? new Date() : end
    const from = new Date(to.getTime() - 5 * 60 * 1000)

    setViewport({ from, to })

    if (!isToday) setMode("historical")
  }, [selectedDate])

  // 🔥 Debounce interval
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInterval(intervalSec), 500)
    return () => clearTimeout(t)
  }, [intervalSec])

  // 🔥 Snap viewport when interval changes
  useEffect(() => {
    setViewport(prev => ({
      ...prev,
      to: roundToInterval(prev.to, debouncedInterval),
    }))
  }, [debouncedInterval])

  // 🔥 Realtime auto-scroll
  useEffect(() => {
    if (mode !== "realtime" || !isToday) return

    const id = setInterval(() => {
      const now = new Date()

      setViewport(prev => {
        const duration = prev.to.getTime() - prev.from.getTime()
        return {
          from: new Date(now.getTime() - duration),
          to: roundToInterval(now, intervalSec),
        }
      })
    }, 5000)

    return () => clearInterval(id)
  }, [mode, isToday, intervalSec])

  // 🔥 PAN
  const pan = (direction: "left" | "right") => {
    const duration = viewport.to.getTime() - viewport.from.getTime()
    const shift = duration * 0.5
    const delta = direction === "left" ? -shift : shift

    let newFrom = new Date(viewport.from.getTime() + delta)
    let newTo = new Date(viewport.to.getTime() + delta)

    if (newFrom < start) {
      newFrom = start
      newTo = new Date(start.getTime() + duration)
    }

    if (newTo > maxEnd) {
      newTo = maxEnd
      newFrom = new Date(maxEnd.getTime() - duration)
    }

    setViewport({ from: newFrom, to: newTo })
    setMode("historical")
  }

  const applyZoom = (z: typeof zoomLevels[number]) => {
    setIntervalSec(z.seconds)
    setSelectedZoomLevel(z.label)

    const baseEnd = isToday ? new Date() : end
    const to = baseEnd
    const from = new Date(to.getTime() - z.windowMs)

    setViewport({
      from: from < start ? start : from,
      to,
    })

    setMode("historical")
  }

  // 🔥 FETCH
  const { data, isLoading } = useGetPPPHistoryQuery(
    {
      username: username as string,
      from: viewport.from.toISOString(),
      to: viewport.to.toISOString(),
      interval: debouncedInterval,
    },
    {
      pollingInterval: mode === "realtime" && isToday ? 3000 : 0,
    }
  )

  const chartData =
    data?.map(d => ({
      ...d,
      recordedAt: new Date(d.recordedAt),
    })) ?? []

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Button onClick={() => router.back()} variant="secondary">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <h1 className="text-lg font-semibold">
          {username} Bandwidth
        </h1>

        <div className="flex gap-2">
          <div className="flex gap-2 items-center">
            <Switch
              id="toggle-realtime"
              checked={mode === "realtime"}
              onCheckedChange={(check)=>setMode(check? "realtime" : "historical")}
              disabled={!isToday}
            />
            <Label htmlFor="toggle-realtime" className="capitalize">{mode}</Label>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[420px] border rounded-xl p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-upload)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-upload)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

                <linearGradient id="fillDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-download)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-download)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="recordedAt"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString()
                }
              />

              <YAxis
                unit=" Mbps"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                cursor={false}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />

              <Area
                dataKey="rx_mbps"
                type="natural"
                fill="url(#fillUpload)"
                stroke="var(--color-upload)"
                strokeWidth={2}
                dot={false}
                name="Upload"
              />

              <Area
                dataKey="tx_mbps"
                type="natural"
                fill="url(#fillDownload)"
                stroke="var(--color-download)"
                strokeWidth={2}
                dot={false}
                name="Download"
              />
            </AreaChart>

          </ResponsiveContainer>
        )}
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* DATE */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {selectedDate.toDateString()}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
            />
          </PopoverContent>
        </Popover>

        {/* INTERVAL */}
        <div className="w-[200px]">
          <div className="text-sm mb-1">Interval: {intervalSec}s</div>
          <Slider
            min={0}
            max={intervalOptions.length - 1}
            step={1}
            value={[intervalOptions.indexOf(intervalSec)]}
            onValueChange={(val) => {
              setIntervalSec(intervalOptions[val[0]])
              setMode("historical")
            }}
          />
        </div>

        {/* PAN */}
        <Button onClick={() => pan("left")} variant="outline"><ArrowLeft /></Button>
        <Button onClick={() => pan("right")} disabled={isAtEnd} variant="outline">
          <ArrowRight />
        </Button>

        {/* ZOOM */}
        {zoomLevels.map(z => (
          <Button key={z.label} variant={selectedZoomLevel === z.label ? "default" : "outline"} onClick={() => applyZoom(z)}>
            {z.label}
          </Button>
        ))}
      </div>
    </div>
  )
}