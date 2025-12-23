"use client"

import DeleteConfirmAction from '@/components/dialogs/confirmation-dialog'
import CreateClientTypeDialog from '@/components/dialogs/create-client-type-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { withRoleGuard } from '@/lib/withRoleGuard'
import { useDeleteClientTypeMutation, useGetClientTypesQuery } from '@/redux/fetures/client-type-slice'
import { clientTypeSchema } from '@/types/clients'
import { UserRole } from '@/types/users'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ClientTypePage = () => {
    const {data: clientTypes, isLoading} = useGetClientTypesQuery()
    const [openCreate, setOpenCreate] = useState(false)
    const [deleteClientType] = useDeleteClientTypeMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [selectedClientType, setSelectedClientType] = useState<clientTypeSchema | null>(null)

    const handleDelete = async(id: string) => {
        try {
            await deleteClientType({id}).unwrap()
            toast.success("Client type deleted")
        } catch (error) {
            console.log(error)
            toast.error("Error while deleting")
        }
    }

  return (
    <PageWrapper
        pageName='Client Types'
        description='Create and manage client types with ease'
    >
        <div className='space-y-4'>
            <Button onClick={()=>setOpenCreate(true)}><IconPlus className='h-4 w-4' /> Create</Button>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {isLoading? (
                    [...Array(4)].map((_, index) => (
                        <Card key={index}>
                            <CardContent className='max-w-[500px]'>
                                <Skeleton className='h-8 w-full' />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    clientTypes?.map((type)=>(
                        <Card key={type.id}>
                            <CardContent className='max-w-[500px] flex flex-row justify-between'>
                                <h1 className='text-xl font-medium'>{type.name}</h1>
                                <div className='flex flex-row gap-2 items-center'>
                                    <IconPencil 
                                        onClick={()=>{setIsEditing(true); setSelectedClientType(type)}}
                                    className='h-5 w-5 text-yellow-500' />
                                    <DeleteConfirmAction 
                                        triggerButton={<IconTrash 
                                            className='h-5 w-5 text-destructive' 
                                        />}
                                        title='Delete Confirmation'
                                        message='Are you sure you want to delete this client type?'
                                        onConfirm={()=>handleDelete(type.id)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
        <CreateClientTypeDialog 
            open={openCreate || isEditing} 
            isEditing={isEditing} 
            onOpenChange={(open) => {setOpenCreate(open); setIsEditing(open); setSelectedClientType(open? selectedClientType : null)}} 
            selectedClientType={selectedClientType!} 
        />
    </PageWrapper>
  )
}

export default withRoleGuard(ClientTypePage, {roles: [UserRole.SUPERADMIN]})