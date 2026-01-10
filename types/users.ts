export interface UsersDataSchema {
    id: string
    fullName: string
    email: string
    role: UserRole
    employeeId?: string
    allowAccess: boolean
    employee?: {
        id: string
        fullName: string
        team?: {
            id: string
            name: string
        }
    }
    providerId?: string
    provider?: {
        id: string
        name: string
    }
}

export enum UserRole {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  INSTALLER_TECHNICIAN = "INSTALLER_TECHNICIAN",
  CLIENT = "CLIENT"
}

export interface CreateUserInput {
    employeeId?: string
    clientId?: string
    role: string
    password: string
}