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
CartesianGrid,
AreaChart,
Area
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
  "5m": { type: "relative", ms: 5 * 60 * 1000 },
  "15m": { type: "relative", ms: 15 * 60 * 1000 },
  "1h": { type: "relative", ms: 60 * 60 * 1000 },

  "today": { type: "day", offset: 0 },
  "yesterday": { type: "day", offset: 1 },
  "2daysAgo": { type: "day", offset: 2 },
  "3daysAgo": { type: "day", offset: 3 },
  "4daysAgo": { type: "day", offset: 4 },
  "5daysAgo": { type: "day", offset: 5 },
  "6daysAgo": { type: "day", offset: 6 },
};

const getInterval = (from: string, to: string) => {
  const diff = new Date(to).getTime() - new Date(from).getTime();

  if (diff <= 1 * 60 * 60 * 1000) return 2;        // ≤1h → 2s
  if (diff <= 6 * 60 * 60 * 1000) return 5;        // ≤6h → 5s
  if (diff <= 24 * 60 * 60 * 1000) return 10;      // ≤1d → 10s
  return 60; // >1d → 1 minute 🔥
};

const roundToInterval = (date: Date, seconds: number) => {
  const ms = seconds * 1000;
  return new Date(Math.floor(date.getTime() / ms) * ms);
};

export default function PPPGraphPage(){
  const now = new Date();
  const { username } = useParams()
  const router = useRouter()
  const [range,setRange] = useState<keyof typeof ranges>("5m")
  const [intervalSec, setIntervalSec] = useState(2)
  const [timeRange, setTimeRange] = useState({ from: (new Date(now.getTime() - (5 * 60 * 1000))).toISOString(), to: roundToInterval(now, intervalSec).toISOString() })
  
  useEffect(() => {
    const intervalSeconds = getInterval(timeRange.from, timeRange.to)
    setIntervalSec(intervalSeconds)
    const updateTimeRange = () => {
      const now = new Date();
      const selected: any = ranges[range];

      console.log(selected)

      let from: Date;
      let to: Date;

      if (selected.type === "relative") {
        // 🔥 REAL-TIME MODE (5m → 1h)
        to = roundToInterval(now, intervalSeconds); // always current time
        from = new Date(now.getTime() - selected.ms);
      } else {
        // 🔒 FIXED DAY MODE (yesterday, etc.)
        const target = new Date();
        target.setDate(now.getDate() - selected.offset);

        from = new Date(target.setHours(0, 0, 0, 0));
        to = new Date(target.setHours(23, 59, 59, 999));
      }

      setTimeRange({
        from: from.toISOString(),
        to: to.toISOString(),
      });
    };

    updateTimeRange();

    // 🔥 Only auto-update for real-time ranges
    const isRealtime = ranges[range].type === "relative";

    if (!isRealtime) return; // 🚀 stop interval for historical days

    const interval = setInterval(updateTimeRange, 5000);
    return () => clearInterval(interval);
  }, [range]);

  const { data, isLoading } = useGetPPPHistoryQuery(
    {
      username: username as string,
      from: timeRange.from,
      to: timeRange.to,
      interval: intervalSec
    },
    {
      pollingInterval: range === "5m" ? 10000 : 60000,
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

    </div>

  )

}