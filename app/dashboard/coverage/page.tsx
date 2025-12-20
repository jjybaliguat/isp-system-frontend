"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import PageWrapper from '@/components/wrapper/page-wrapper'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import 'leaflet/dist/leaflet.css'
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import L from "leaflet";
import CreateCoverageDialog from '@/components/dialogs/create-coverage-dialog'
import { useDeleteCoverageMutation, useGetCoverageQuery } from '@/redux/fetures/converage-api-slice'
import { getCenterLocation } from '@/utils/getCenterLocation'
import { PencilIcon } from 'lucide-react'
import { CoverageDataSchema } from '@/types/coverage'
import DeleteConfirmAction from '@/components/dialogs/confirmation-dialog'
import { toast } from 'sonner'
import { withRoleGuard } from '@/lib/withRoleGuard'
import CoverageTable from '@/components/tables/coverage-table'

const customIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: "/marker-shadow.png",
  shadowSize: [80, 40],
  shadowAnchor: [20, 40]
});

const CoveragePage = () => {
    const animateRef = useRef(false)
    const [center, setCenter] = useState<[number, number]>([14.7463199, 121.1409568])
    const [openCreateCoverage, setopenCreateCoverage] = useState(false)
    const {data: coverage, isLoading, isError} = useGetCoverageQuery()
    const [deleteCoverage] = useDeleteCoverageMutation()
    const [edit, setEdit] = useState<{isEditing: boolean, coverage: CoverageDataSchema | null}>({
        isEditing: false,
        coverage: null
    })

    useEffect(()=>{
        if(coverage && (!isLoading || !isError)){
            setCenter(getCenterLocation(coverage))
        }
    }, [coverage])


      function SetViewOnClick({ animateRef } : any) {
        const map = useMapEvent('click', (e) => {
          map.setView(e.latlng, map.getZoom(), {
            animate: animateRef.current = !animateRef.current
          })
          setCenter([e.latlng.lat, e.latlng.lng])
        })
    
        return null
      }

        function MapUpdater({ latitude, longitude }: {latitude: number, longitude: number}) {
          const map = useMap();
          useEffect(() => {
            if (!isNaN(latitude) && !isNaN(longitude)) {
              map.flyTo([latitude, longitude]);
              map.getZoom()
            }
          }, [latitude, longitude, map]);
          return null;
        }

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
    <PageWrapper
        pageName='Coverage Areas'
        description='Manage your service coverage areas'
    >
        <div className='space-y-4'>
            <Button onClick={()=>setopenCreateCoverage(true)}><IconPlus /> Add Coverage</Button>

            <div className='relative w-full h-[600px]'>
                <MapContainer
                  center={center}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full rounded-md z-50"
                >
                  <SetViewOnClick animateRef={animateRef} />
                  <MapUpdater latitude={center[0]} longitude={center[1]} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {coverage?.map((area)=> (
                    <div key={area.id}>
                        <Marker 
                            position={[area.latitude, area.longitude]}
                            icon={customIcon}
                            >
                            <Popup minWidth={180}>
                                    <p className='flex items-center gap-2 text-[18px] font-bold'>{area.name} 
                                        <span
                                        className='flex items-center gap-2'
                                        >
                                          <PencilIcon className='h-4 w-4 text-yellow-700' 
                                            onClick={()=>setEdit({isEditing: true, coverage: area})}
                                          />
                                          <DeleteConfirmAction
                                            title='Delete Confirmation'
                                            triggerButton={<IconTrash className='h-4 w-4 text-destructive' />}
                                            message='Are you sure you want to delete this coverage? This will set all clients coverage related to this to null.'
                                            onConfirm={()=>handleDelete(area.id)}
                                          />
                                        </span>
                                    </p>
                                    <p>Total Clients: {area.clients?.length}</p>
                                
                            </Popup>
                        </Marker>
                        <Circle
                            className="animate-pulse"
                            center={[area.latitude, area.longitude]}
                            pathOptions={{ fillColor: 'blue' }}
                            radius={area.radius}
                        />
                    </div>
                  ))}
                </MapContainer>
            </div>
            <CoverageTable data={coverage || []} />
            <CreateCoverageDialog 
                open={openCreateCoverage || edit.isEditing} 
                onOpenChange={(open)=>{setopenCreateCoverage(open); setEdit({...edit, isEditing: open, coverage: null})}} 
                isEditing={edit.isEditing} 
                coverage={edit.coverage!} 
            />
        </div>
    </PageWrapper>
  )
}

export default withRoleGuard(CoveragePage, ["SUPERADMIN"])