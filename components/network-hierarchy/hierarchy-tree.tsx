"use client"

import { ChevronDown, ChevronRight, Edit2, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LCP, ODC, ODP, OLT } from "@/types/networks"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HierarchyTreeProps {
  olts: OLT[]
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
  onEdit?: (type: string, item: any) => void
  onDelete?: (type: string, id: string) => void
  onAdd?: (type: string, parentId: string) => void
}

interface ExpandedState {
  [key: string]: boolean
}

export default function HierarchyTree({
  olts,
  selectedItem,
  onSelectItem,
  onEdit,
  onDelete,
  onAdd,
}: HierarchyTreeProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getMarkerColor = (type: string) => {
    const colors: { [key: string]: string } = {
      OLT: "bg-blue-100 text-blue-700 border-blue-300",
      PonPort: "bg-indigo-100 text-indigo-700 border-indigo-300",
      LCP: "bg-green-100 text-green-700 border-green-300",
      ODC: "bg-orange-100 text-orange-700 border-orange-300",
      ODP: "bg-red-100 text-red-700 border-red-300",
      OdpPort: "bg-purple-100 text-purple-700 border-purple-300",
      Client: "bg-gray-100 text-gray-700 border-gray-300",  
      OCCUPIED: "bg-red-200 text-red-700 border-red-400",
      AVAILABLE: "bg-green-200 text-green-700 border-green-400",
      DAMAGED: "bg-gray-100 text-gray-700 border-gray-300"
    }
    return colors[type] || "bg-gray-100 text-gray-700 border-gray-300"
  }

  return (
    <div className="space-y-2 text-sm">
      {olts.map((olt) => (
        <div key={olt.id}>
          <TreeNode
            type="OLT"
            name={olt.name}
            id={olt.id}
            isExpanded={expanded[olt.id]}
            onToggle={() => toggleExpand(olt.id)}
            isSelected={selectedItem?.id === olt.id}
            onSelect={() => onSelectItem({ type: "OLT", id: olt.id })}
            hasChildren={olt.ponPorts && olt.ponPorts.length > 0}
            colorClass={getMarkerColor("OLT")}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
          />

          {expanded[olt.id] && olt.ponPorts && (
            <div className="ml-4">
              {olt.ponPorts.map((ponPort) => (
                <div key={ponPort.id}>
                  <TreeNode
                    type="PonPort"
                    name={`PON Port ${ponPort.portNumber}`}
                    description={ponPort.description}
                    id={ponPort.id}
                    isExpanded={expanded[ponPort.id]}
                    onToggle={() => toggleExpand(ponPort.id)}
                    isSelected={selectedItem?.id === ponPort.id}
                    onSelect={() => onSelectItem({ type: "PonPort", id: ponPort.id })}
                    hasChildren={ponPort.lcps && ponPort.lcps.length > 0}
                    colorClass={getMarkerColor("PonPort")}
                    level={1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAdd={onAdd}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                  />

                  {expanded[ponPort.id] && ponPort.lcps && (
                    <div className="ml-4">
                      {ponPort.lcps.map((lcp) => (
                        <LCPNode
                          key={lcp.id}
                          lcp={lcp}
                          expanded={expanded}
                          onToggle={toggleExpand}
                          selectedItem={selectedItem}
                          onSelectItem={onSelectItem}
                          getMarkerColor={getMarkerColor}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onAdd={onAdd}
                          hoveredId={hoveredId}
                          setHoveredId={setHoveredId}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface TreeNodeProps {
  type: string
  name: string
  description?: string
  id: string
  isExpanded: boolean
  onToggle: () => void
  isSelected: boolean
  onSelect: () => void
  hasChildren: boolean
  colorClass: string
  level: number
  onEdit?: (type: string, item: any) => void
  onDelete?: (type: string, id: string) => void
  onAdd?: (type: string, parentId: string) => void
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

function TreeNode({
  type,
  name,
  description,
  id,
  isExpanded,
  onToggle,
  isSelected,
  onSelect,
  hasChildren,
  colorClass,
  level,
  onEdit,
  onDelete,
  onAdd,
  hoveredId,
  setHoveredId,
}: TreeNodeProps) {
  const childTypesMap: Record<string, string[]> = {
    OLT: ["PonPort"],
    PonPort: ["LCP"],
    LCP: ["ODC"],
    ODC: ["ODP"],
    ODP: ["OdpPort"],
    OdpPort: ["Client"]
  }
  const childTypes = childTypesMap[type] || []

  return (
      <div
        className={cn(
          "relative flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-accent border-l-2 border-primary",
        )}
        onClick={onSelect}
        onMouseEnter={()=>setHoveredId(id)}
        // onMouseLeave={() => setHoveredId(null)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="p-0"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-4" />
        )}

        <span className={cn("inline-flex items-center px-2 py-1 rounded text-xs font-medium border", colorClass)}>
          {type}
        </span>
        <div className="flex flex-col gap-1">
          <span className="truncate">{name}</span>
          <span className="truncate text-muted-foreground text-sm">{description}</span>
        </div>
        
        {hoveredId === id && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-50">
            {onEdit && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onEdit(type, { id, name })
                }}
                variant="ghost"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onDelete(type, id)
                }}
                variant="ghost"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {onAdd && childTypes.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-4 w-4 p-0" onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {childTypes.map((childType) => (
                    <DropdownMenuItem key={childType} onClick={() => onAdd(childType, id)}>
                      {childType === "Client"? "Assign" : "Add"} {childType}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
  )
}



interface LCPNodeProps {
  lcp: LCP
  expanded: ExpandedState
  onToggle: (id: string) => void
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
  getMarkerColor: (type: string) => string
  onEdit?: (type: string, item: any) => void
  onDelete?: (type: string, id: string) => void
  onAdd?: (type: string, parentId: string) => void
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

function LCPNode({
  lcp,
  expanded,
  onToggle,
  selectedItem,
  onSelectItem,
  getMarkerColor,
  onEdit,
  onDelete,
  onAdd,
  hoveredId,
  setHoveredId,
}: LCPNodeProps) {
  return (
    <div key={lcp.id}>
      <TreeNode
        type="LCP"
        name={lcp.lcpCode}
        id={lcp.id}
        isExpanded={expanded[lcp.id]}
        onToggle={() => onToggle(lcp.id)}
        isSelected={selectedItem?.id === lcp.id}
        onSelect={() => onSelectItem({ type: "LCP", id: lcp.id })}
        hasChildren={lcp.odcs && lcp.odcs.length > 0}
        colorClass={getMarkerColor("LCP")}
        level={2}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
      />

      {expanded[lcp.id] && lcp.odcs && (
        <div className="ml-4">
          {lcp.odcs.map((odc) => (
            <ODCNode
              key={odc.id}
              odc={odc}
              expanded={expanded}
              onToggle={onToggle}
              selectedItem={selectedItem}
              onSelectItem={onSelectItem}
              getMarkerColor={getMarkerColor}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ODCNodeProps {
  odc: ODC
  expanded: ExpandedState
  onToggle: (id: string) => void
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
  getMarkerColor: (type: string) => string
  onEdit?: (type: string, item: any) => void
  onDelete?: (type: string, id: string) => void
  onAdd?: (type: string, parentId: string) => void
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

function ODCNode({
  odc,
  expanded,
  onToggle,
  selectedItem,
  onSelectItem,
  getMarkerColor,
  onEdit,
  onDelete,
  onAdd,
  hoveredId,
  setHoveredId,
}: ODCNodeProps) {
  return (
    <div key={odc.id}>
      <TreeNode
        type="ODC"
        name={odc.name}
        id={odc.id}
        isExpanded={expanded[odc.id]}
        onToggle={() => onToggle(odc.id)}
        isSelected={selectedItem?.id === odc.id}
        onSelect={() => onSelectItem({ type: "ODC", id: odc.id })}
        hasChildren={odc.odps && odc.odps.length > 0}
        colorClass={getMarkerColor("ODC")}
        level={3}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
      />

      {expanded[odc.id] && odc.odps && (
        <div className="ml-4">
          {odc.odps.map((odp) => (
            <ODPNode
              key={odp.id}
              odp={odp}
              expanded={expanded}
              onToggle={onToggle}
              selectedItem={selectedItem}
              onSelectItem={onSelectItem}
              getMarkerColor={getMarkerColor}
              onEdit={onEdit}
              onDelete={onDelete}
              onAdd={onAdd}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ODPNodeProps {
  odp: ODP
  expanded: ExpandedState
  onToggle: (id: string) => void
  selectedItem: { type: string; id: string } | null
  onSelectItem: (item: { type: string; id: string }) => void
  getMarkerColor: (type: string) => string
  onEdit?: (type: string, item: any) => void
  onDelete?: (type: string, id: string) => void
  onAdd?: (type: string, parentId: string) => void
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

function ODPNode({
  odp,
  expanded,
  onToggle,
  selectedItem,
  onSelectItem,
  getMarkerColor,
  onEdit,
  onDelete,
  onAdd,
  hoveredId,
  setHoveredId,
}: ODPNodeProps) {
  const hasChildren = odp.ports && odp.ports.length > 0;

  return (
    <div key={odp.id}>
      <TreeNode
        type="ODP"
        name={odp.name}
        id={odp.id}
        isExpanded={expanded[odp.id]}
        onToggle={() => onToggle(odp.id)}
        isSelected={selectedItem?.id === odp.id}
        onSelect={() => onSelectItem({ type: "ODP", id: odp.id })}
        hasChildren={hasChildren}
        colorClass={getMarkerColor("ODP")}
        level={4}
        onEdit={onEdit}
        onDelete={onDelete}
        onAdd={onAdd}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
      />

      {expanded[odp.id] && (
        <div className="ml-4 space-y-1">
          {odp.ports?.map((port) => {
            return (
              <div key={port.id}>
                <TreeNode
                  type="OdpPort"
                  name={`Port ${port.portNumber} — ${port.status}`}
                  id={port.id}
                  isExpanded={expanded[port.id]}
                  onToggle={() => onToggle(port.id)}
                  isSelected={selectedItem?.id === port.id}
                  onSelect={() => onSelectItem({ type: "ODP Port", id: port.id })}
                  hasChildren={port.status === "OCCUPIED"}
                  colorClass={getMarkerColor(port.status)}
                  level={5}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAdd={onAdd}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                />

                {expanded[port.id] && port.status === "OCCUPIED" && (
                  <div className="ml-4">
                    <TreeNode
                      type="Client"
                      name={port.client?.fullName!}
                      id={port.clientId!}
                      isExpanded={false}
                      onToggle={() => {}}
                      isSelected={selectedItem?.id === port.clientId}
                      onSelect={() => onSelectItem({ type: "Client", id: port.clientId! })}
                      hasChildren={false}
                      colorClass={getMarkerColor("Client")}
                      level={6}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAdd={onAdd}
                      hoveredId={hoveredId}
                      setHoveredId={setHoveredId}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
