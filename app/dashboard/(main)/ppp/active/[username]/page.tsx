"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts"

import { Button } from "@/components/ui/button"
import { useGetPPPHistoryQuery } from "@/redux/fetures/mikrotik-api-slice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

interface Data {
  recordedAt: string
  rx_mbps: number
  tx_mbps: number
}

const ranges = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "2days": 2 * 24 * 60 * 60 * 1000,
  "3days": 3 * 24 * 60 * 60 * 1000,
  "7days": 7 * 24 * 60 * 60 * 1000
}

export default function PPPGraphPage(){

  const { username } = useParams()
  const router = useRouter()
  const [range,setRange] = useState<keyof typeof ranges>("5m")
  const [timeRange, setTimeRange] = useState({ from: "", to: "" })

  useEffect(()=>{
    const updateTimeRange = () => {
      const now = new Date()
      const start = new Date(now.getTime() - ranges[range])
      setTimeRange({ from: start.toISOString(), to: now.toISOString() })
    }

    updateTimeRange()
    const interval = setInterval(updateTimeRange, 10000)
    return () => clearInterval(interval)
  }, [range])

  const { data, isLoading } = useGetPPPHistoryQuery(
    {
      username: username as string,
      from: timeRange.from,
      to: timeRange.to
    },
    {
      pollingInterval: 10000,   // auto refetch every second
      refetchOnFocus: true,
      refetchOnReconnect: true
    }
  )

  const chartData: Data[] = data ?? []

  return(

    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
         <Button
        onClick={() => router.back()}
        className="absolute left-0 top-0 z-10 md:static md:mr-4"
        variant="secondary"
        >
        <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h1 className="text-lg md:text-xl font-semibold">
            {username} Bandwidth History
        </h1>

        <Select
            value={range}
            onValueChange={(val) => setRange(val as keyof typeof ranges)}
            >
            <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by range" />
            </SelectTrigger>

            <SelectContent>
                {Object.keys(ranges).map((key) => (
                <SelectItem key={key} value={key}>
                    {key}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>

        </div>

      {/* Chart */}

      <div className="h-[420px] border rounded-xl p-4">

        {isLoading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Loading bandwidth history...
          </div>
        ) : (

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="recordedAt"
                tickFormatter={(time)=>new Date(time).toLocaleTimeString()}
              />

              <YAxis
                unit=" Mbps"
              />

              <Tooltip
                labelFormatter={(time)=>new Date(time).toLocaleString()}
              />

              <Line
                type="monotone"
                dataKey="rx_mbps"
                stroke="#ff3300"
                strokeWidth={2}
                dot={false}
                name="Upload"
              />

              <Line
                type="monotone"
                dataKey="tx_mbps"
                stroke="#0000ff"
                strokeWidth={2}
                dot={false}
                name="Download"
              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>

  )

}