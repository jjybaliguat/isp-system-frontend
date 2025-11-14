import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useCreateTeamsMutation, useUpdateTeamMutation } from '@/redux/fetures/teams-api-slice'
import { TeamsDataSchema } from '@/types/teams'
import { toast } from 'sonner'

interface DialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    isEditing?: boolean
    team?: TeamsDataSchema
}

const CreateTeamDialog = ({open, onOpenChange, isEditing, team}: DialogProps) => {
    const [submitting, setSubmitting] = useState(false)
    const [createTeam] = useCreateTeamsMutation()
    const [updateTeam] = useUpdateTeamMutation()
    const [teamName, setTeamName] = useState(team?.name || "")

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        if(isEditing){
            try {
                await updateTeam({id: team?.id!, data: {teamName}}).unwrap()
                toast("Success", {
                    description: "Team updated successfully"
                })
                setSubmitting(false)
                onOpenChange(false)
            } catch (error: any) {
                console.log(error)
                toast("Error", {
                    description: error.data.message
                })
            }
        }else{
            try {
                await createTeam({
                    teamName
                }).unwrap()
    
                toast("Success", {
                    description: "Team created successfully"
                })
                setTeamName("")
                setSubmitting(false)
                onOpenChange(false)
            } catch (error: any) {
                console.log(error)
                toast("Error", {
                    description: error.data.message
                })
            }
        }
    }

  return (
    <Dialog
        open={open}
        onOpenChange={onOpenChange}
    >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>{isEditing? "Edit Team" : "Create Team"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='teamName'>Team Name</Label>
                    <Input
                        id='teamName'
                        placeholder='team name'
                        name='teamName'
                        value={teamName}
                        onChange={(e)=> setTeamName(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Save"}
                  </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreateTeamDialog