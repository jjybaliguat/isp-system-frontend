"use client"

import PageWrapper from '@/components/wrapper/page-wrapper'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@tabler/icons-react'
import CreateServicePlanDialog from '@/components/dialogs/create-service-plan-dialog'
import { useDeleteServicePlanMutation, useGetServicePlanQuery } from '@/redux/fetures/service-plan-api-slice'
import { formatCurrency } from '@/utils/formatCurrency'
import { Skeleton } from '@/components/ui/skeleton'
import { ServicePlanDataSchema } from '@/types/service-plan'
import { toast } from 'sonner'
import DeleteConfirmAction from '@/components/dialogs/confirmation-dialog'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { UserRole } from '@/types/users'

const ServicePlanPlage = () => {
    const {data: servicePlans, isLoading} = useGetServicePlanQuery()
    const [deleteServicePlan] = useDeleteServicePlanMutation()
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<ServicePlanDataSchema | null>(null)

    const handleDelete = async(id: string) => {
            try {
                await deleteServicePlan({id})
                toast("Success", {
                    description: "Service plan deleted successfully"
                })
            } catch (error) {
                console.log(error)
                toast("Error", {
                    description: "Error while deleting service plan"
                })
            }
    }

  return (
    <PageWrapper
        pageName='Service Plans'
        description='Manage your service plans with ease'
    >   
        <div className="space-y-4">
            <Button onClick={() => setOpenCreateDialog(true)}><IconPlus className='h-4 w-4'/> Create</Button>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {!isLoading? (
                    servicePlans?.map((plan)=> (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-medium">{plan.name}</CardTitle>
                            <span className="my-3 block text-2xl font-semibold">{formatCurrency(plan.monthlyFee)} / mo</span>
                            <CardDescription className="text-sm">Upto {plan.speedMbps}MBPS Speed</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <hr className="border-dashed" />
                            <ul className="list-outside space-y-3 text-sm">
                                {plan.descriptions?.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 mt-auto">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={()=>{setIsEditing(true); setSelectedPlan(plan)}}    
                            >
                                    Edit
                            </Button>
                            <DeleteConfirmAction
                                title="Delete Confirmation" 
                                message="Are you sure you want to delete this service plan? This can't be undone."
                                triggerButton={<Button variant="destructive" size="sm" className="w-full">Delete</Button>}
                                onConfirm={()=>handleDelete(plan.id)}
                              />
                        </CardFooter>
                    </Card>
                ))) : (
                    [[...Array(4)].map((_, index)=> (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle><Skeleton className='h-8 w-full' /></CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <hr className="border-dashed" />
                                <ul className="list-outside space-y-3 text-sm">
                                    {[...Array(4)].map((_, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center gap-2">
                                            <Skeleton className='h-4 w-40' />
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))]
                )}
            </div>
        </div>
        <CreateServicePlanDialog 
            open={openCreateDialog || isEditing} 
            isEditing={isEditing}
            onOpenChange={(open)=>{setOpenCreateDialog(open); setIsEditing(open); setSelectedPlan(open? selectedPlan : null)}}
            servicePlan={selectedPlan!}
        />
    </PageWrapper>
  )
}

export default withRoleGuard(ServicePlanPlage, {roles: [UserRole.SUPERADMIN]})