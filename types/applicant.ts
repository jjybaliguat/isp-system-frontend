import { CoverageDataSchema } from "./coverage"
import { ProviderDataSchema } from "./provider"
import { ServicePlanDataSchema } from "./service-plan"

export interface ApplicantDataSchema {
  id: string
  name: string
  applicationNumber?: string
  email: string
  phone: string
  address: string
  notes: string
  idType: string
  idCardNumber: string
  coverageId: string
  coverage: CoverageDataSchema
  servicePlanId: string
  servicePlan: ServicePlanDataSchema
  providerId: string
  provider: ProviderDataSchema
  applicationStatus: ApplicationStatus
  createdAt: string
  updatedAt: string
}

enum ApplicationStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  ONGOING = "ONGOING",
  INSTALLED = "INSTALLED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}