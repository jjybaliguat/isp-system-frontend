export enum MikroTikDeviceStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

export interface MikroTikRemoteStatusResponse {
  status: "online" | "offline"
}

export interface MikroTikDevice {
  id: string
  name: string
  username: string
  password?: string
  wireguardKeys?: WireGuardKeys
  connectScript?: string
  createdAt?: string
  updatedAt?: string
}

interface WireGuardKeys {
  publicKey: string
  privateKey: string
  assignedIp: string
}

export interface MikroTikSession {
  id: string
  username: string
  address: string
  uptime: string
  bytesIn: number
  bytesOut: number
}

export interface MikroTikBandwidth {
  timestamp: string
  upload: number
  download: number
}

export interface MikroTikQueue {
  id: string
  name: string
  target: string
  maxLimit: string
  burstLimit: string
}

export interface MikroTikAPICommand {
  id: string
  deviceId: string
  command: string
  response: string
  status: "SUCCESS" | "ERROR"
  executedAt: string
}

export interface CreateMikroTikDeviceInput {
  deviceName: string
  ipAddress: string
  username: string
  password: string
  clientId?: string
}

export interface ExecuteAPICommandInput {
  deviceId: string
  command: string
}
