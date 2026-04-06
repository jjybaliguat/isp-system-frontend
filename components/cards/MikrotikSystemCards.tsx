"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, MemoryStick, Timer, Server } from "lucide-react"

type Props = {
  system: any
}

export default function MikrotikSystemCards({ system }: Props) {
  if (!system) return null

  const formatMB = (bytes: number) =>
    (bytes / 1024 / 1024).toFixed(0)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      
      {/* Identity */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Router Identity
          </CardTitle>
          <Server className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{system.identity}</p>
          <p className="text-xs text-muted-foreground">
            {system.boardName} • v{system.version}
          </p>
        </CardContent>
      </Card>

      {/* CPU */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            CPU Load
          </CardTitle>
          <Cpu className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {system.cpu.load}%
          </p>
          <p className="text-xs text-muted-foreground">
            {system.cpu.count} cores • {system.cpu.frequency} MHz
          </p>
        </CardContent>
      </Card>

      {/* Memory */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Memory Usage
          </CardTitle>
          <MemoryStick className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {formatMB(system.memory.used)} MB
          </p>
          <p className="text-xs text-muted-foreground">
            {formatMB(system.memory.free)} MB free /{" "}
            {formatMB(system.memory.total)} MB total
          </p>
        </CardContent>
      </Card>

      {/* Uptime */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Uptime
          </CardTitle>
          <Timer className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{system.uptime}</p>
        </CardContent>
      </Card>
    </div>
  )
}