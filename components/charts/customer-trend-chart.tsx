"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useGetClientsChartDataQuery } from "@/redux/fetures/clientApiSlice"
import { Skeleton } from "../ui/skeleton"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function CustomerTrendsChart() {
  const isMobile = useIsMobile()
  const {data: chartData, isLoading} = useGetClientsChartDataQuery()
  const [timeRange, setTimeRange] = React.useState("365d")
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData?.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = chartData[chartData.length-1].date
    let daysToSubtract = 365
    if(timeRange === "365d"){
      daysToSubtract = 365
    }else if (timeRange === "180d") {
      daysToSubtract = 180
    } else if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const getNewCustomerCount = () => {
    let countNew = 0;
    let countTerminated = 0;
    filteredData?.map((data)=> {
      countNew+=data.new;
      countTerminated+=data.terminated
    })
    return {countNew, countTerminated}
  }

    if(isLoading) {
      return <ClientsChartSkeleton />
    }


  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Customer Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {(() => {
              const days = parseInt(timeRange)
              if(days > 180){
                const year = days / 365
                return `Showing customer trends for the last ${year > 1 ? `${year} years` : `${year} year`}`
              }else if (days > 7) {
                const months = days / 30
                return `Showing customer trends for the last ${months > 1 ? `${months} months` : `${months} month`}`
              }
              return "Showing customer trends for the last 7 days"
            })()}
          </span>
          <span className="@[540px]/card:hidden">
            {(() => {
              const days = parseInt(timeRange)
              if(days > 180){
                const year = days / 365
                return `Showing customer trends for the last ${year > 1 ? `${year} years` : `${year} year`}`
              }else if (days > 7) {
                const months = days / 30
                return `Showing customer trends for the last ${months > 1 ? `${months} months` : `${months} month`}`
              }
              return "Showing customer trends for the last 7 days"
            })()}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="365d">Last 1 year</ToggleGroupItem>
            <ToggleGroupItem value="180d">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d" className="rounded-lg">
                Last 1 year
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTerminated" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-terminated)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-terminated)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNew" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-new)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-new)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="new"
              type="natural"
              fill="url(#fillNew)"
              stroke="var(--color-new)"
              stackId="a"
            />
            <Area
              dataKey="terminated"
              type="natural"
              fill="url(#fillTerminated)"
              stroke="var(--color-terminated)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <CardDescription>
          <p>New Customer: {getNewCustomerCount().countNew}</p>
          <p>Terminated: {getNewCustomerCount().countTerminated}</p>
        </CardDescription>
      </CardFooter>
    </Card>
  )
}

function ClientsChartSkeleton() {
  return (
      <Card className="@container/card">
        <CardHeader className="flex flex-row justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-80" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
  )
}

