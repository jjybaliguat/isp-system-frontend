export interface EmployeesDataSchema {
    id: string,
    fullName: string,
    email: string,
    address: string,
    phoneNumber: string
    role: string,
    hireDate: string,
    status: EmployeeStatus
    teamId?: string
    team?: {
        id: string,
        name: string
    }
}

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}
