import { Accounts, ClientDataSchema } from "./clients"

export enum PonPortStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export enum PortStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  RESERVED = "RESERVED",
  DAMAGED = "DAMAGED",
}

export interface OLT {
  id: string
  name: string
  brand?: string
  model?: string
  ponCount?: number
  ipAddress?: string
  location?: string
  latitude?: number
  longitude?: number
  remarks?: string
  providerId: string
  ponPorts: PonPort[]
  lcps: LCP[]
  createdAt: string
  updatedAt: string
}

export interface PonPort {
  id: string
  portNumber: number
  description?: string
  status: PonPortStatus
  oltId: string
  lcps: LCP[]
  createdAt: string
  updatedAt: string
}

export interface LCP {
  id: string
  lcpCode: string
  location?: string
  latitude?: number
  longitude?: number
  remarks?: string
  ponPortId: string
  oltId: string
  providerId: string
  odcs: ODC[]
  odps: ODP[]
  createdAt: string
  updatedAt: string
}

export interface ODC {
  id: string
  name: string
  cabinetCode?: string
  location?: string
  latitude?: number
  longitude?: number
  remarks?: string
  lcpId: string
  providerId: string
  odps: ODP[]
  createdAt: string
  updatedAt: string
}

export interface ODP {
  id: string
  name: string
  odpCode?: string
  portCount: number
  location?: string
  latitude?: number
  longitude?: number
  remarks?: string
  odcId: string
  providerId: string
  ports: OdpPort[]
  createdAt: string
  updatedAt: string
}

export interface OdpPort {
  id: string
  portNumber: number
  status: PortStatus
  remarks?: string
  odp?: ODP
  odpId: string
  account: Accounts
  client?: {
    fullName: string
  }
  clientId?: string
  createdAt: string
  updatedAt: string
}
