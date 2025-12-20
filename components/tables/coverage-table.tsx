"use client"

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from '../ui/checkbox'
import { formatDateTime } from '@/utils/formatDateTime'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pencil, TrashIcon } from 'lucide-react'
import { CoverageDataSchema } from '@/types/coverage'
import CreateCoverageDialog from '../dialogs/create-coverage-dialog'
import { useDeleteCoverageMutation } from '@/redux/fetures/converage-api-slice'
import { toast } from 'sonner'
import DeleteConfirmAction from '../dialogs/confirmation-dialog'

const CoverageTable = ({
  data
}: { data: CoverageDataSchema[] }) => {
    const [openEditCoverage, setOpenEditCoverage] = React.useState(false)
    const [selectedCoverage, setSelectedCoverage] = React.useState<CoverageDataSchema | null>(null)
    const [deleteCoverage] = useDeleteCoverageMutation()

    const handleDelete = async(id: string) => {
      try {
        await deleteCoverage({id}).unwrap()
        toast.success("Coverage deleted")
      } catch (error) {
        console.log(error)
        toast.success("Error while deleting")
      }
    }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area Name</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Radius</TableHead>
                <TableHead>Total Clients</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No Coverage found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((coverage) => (
                  <TableRow key={coverage.id}>
                    <TableCell className="font-medium">{coverage.name}</TableCell>
                    <TableCell>{coverage.latitude}</TableCell>
                    <TableCell>{coverage.longitude}</TableCell>
                    <TableCell>{coverage.radius}</TableCell>
                    <TableCell>{coverage.clients?.length}</TableCell>
                    <TableCell>
                        <div className='flex items-center gap-2'>
                            <Pencil onClick={()=>{setOpenEditCoverage(true); setSelectedCoverage(coverage)}} className='h-4 w-4 text-yellow-700 cursor-pointer' />
                            <DeleteConfirmAction
                                title="Delete Coverage"
                                message="Are you sure you want to delete this coverage?"
                                onConfirm={() => handleDelete(coverage.id)}
                                triggerButton={<TrashIcon className='h-4 w-4 text-destructive cursor-pointer' />}
                            />
                        </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
          <CreateCoverageDialog
                open={openEditCoverage} 
                onOpenChange={(open)=>{setOpenEditCoverage(open); setSelectedCoverage(null)}} 
                isEditing={true} 
                coverage={selectedCoverage!} 
            />
      </div>
  )
}

export default CoverageTable