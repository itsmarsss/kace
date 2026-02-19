import { useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getBlockStyle } from './blockTypes'

// Custom node component for diagram blocks
function DiagramNode({ data }: { data: any }) {
  const style = getBlockStyle(data.type)

  // Get Tailwind classes based on block type
  const bgClass =
    data.type === 'OBSERVATION'
      ? 'bg-[var(--teal-light)]'
      : data.type === 'INTERPRETATION'
        ? 'bg-[var(--slate-light)]'
        : data.type === 'CONSIDERATION'
          ? 'bg-[var(--amber-light)]'
          : data.type === 'CONTRAINDICATION'
            ? 'bg-[var(--crimson-light)]'
            : 'bg-[var(--green-light)]' // DECISION

  const borderClass =
    data.type === 'OBSERVATION'
      ? 'border-[var(--teal-border)]'
      : data.type === 'INTERPRETATION'
        ? 'border-[var(--slate-border)]'
        : data.type === 'CONSIDERATION'
          ? 'border-[var(--amber-border)]'
          : data.type === 'CONTRAINDICATION'
            ? 'border-[var(--crimson-border)]'
            : 'border-[var(--green-border)]' // DECISION

  const borderTopClass =
    data.type === 'OBSERVATION'
      ? 'border-t-[var(--teal)]'
      : data.type === 'INTERPRETATION'
        ? 'border-t-[var(--slate)]'
        : data.type === 'CONSIDERATION'
          ? 'border-t-[var(--amber)]'
          : data.type === 'CONTRAINDICATION'
            ? 'border-t-[var(--crimson)]'
            : 'border-t-[var(--green)]' // DECISION

  const colorClass =
    data.type === 'OBSERVATION'
      ? 'text-[var(--teal)]'
      : data.type === 'INTERPRETATION'
        ? 'text-[var(--slate)]'
        : data.type === 'CONSIDERATION'
          ? 'text-[var(--amber)]'
          : data.type === 'CONTRAINDICATION'
            ? 'text-[var(--crimson)]'
            : 'text-[var(--green)]' // DECISION

  return (
    <div
      className={`min-w-[280px] max-w-[350px] rounded-[var(--r)] border border-t-[3px] p-[12px_14px] shadow-[var(--shadow-md)] ${bgClass} ${borderClass} ${borderTopClass}`}
    >
      {/* Type label */}
      <div
        className={`mb-1 font-['DM_Sans',sans-serif] text-[9px] font-semibold uppercase tracking-[0.12em] ${colorClass}`}
      >
        {style.label}
        {data.type === 'DECISION' && ' ✓'}
      </div>

      {/* Title */}
      <div className="mb-[5px] font-['DM_Sans',sans-serif] text-[14px] font-semibold leading-[1.35] text-[var(--text-primary)]">
        {data.title}
      </div>

      {/* Body */}
      <div className="font-['DM_Sans',sans-serif] text-[12px] font-normal leading-[1.55] text-[var(--text-secondary)]">
        {data.body}
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  diagramBlock: DiagramNode,
}

interface DiagramFlowProps {
  blocks: any[]
}

export default function DiagramFlow({ blocks }: DiagramFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Convert blocks to React Flow nodes and edges
  useEffect(() => {
    if (blocks.length === 0) return

    // Build adjacency map for level calculation
    const childrenMap = new Map<string, string[]>()
    const parentsMap = new Map<string, string[]>()

    blocks.forEach((block) => {
      childrenMap.set(block.id, [])
      parentsMap.set(block.id, [])
    })

    blocks.forEach((block) => {
      if (block.connects_to) {
        block.connects_to.forEach((targetId: string) => {
          childrenMap.get(block.id)?.push(targetId)
          parentsMap.get(targetId)?.push(block.id)
        })
      }
    })

    // Calculate levels using BFS
    const levels = new Map<string, number>()
    const roots = blocks.filter((b) => (parentsMap.get(b.id)?.length || 0) === 0)
    const queue = roots.map((r) => r.id)
    roots.forEach((r) => levels.set(r.id, 0))

    while (queue.length > 0) {
      const nodeId = queue.shift()!
      const nodeLevel = levels.get(nodeId) || 0
      const children = childrenMap.get(nodeId) || []

      children.forEach((childId) => {
        const currentLevel = levels.get(childId)
        const newLevel = nodeLevel + 1
        if (currentLevel === undefined || newLevel > currentLevel) {
          levels.set(childId, newLevel)
          queue.push(childId)
        }
      })
    }

    // Group by level and position
    const levelGroups = new Map<number, any[]>()
    blocks.forEach((block) => {
      const level = levels.get(block.id) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)?.push(block)
    })

    // Create nodes with positions
    const flowNodes: Node[] = []
    const VERTICAL_SPACING = 200
    const HORIZONTAL_SPACING = 400

    levelGroups.forEach((nodesAtLevel, level) => {
      const levelWidth = nodesAtLevel.length * HORIZONTAL_SPACING
      const startX = -levelWidth / 2

      nodesAtLevel.forEach((block: any, index: number) => {
        flowNodes.push({
          id: block.id,
          type: 'diagramBlock',
          position: {
            x: startX + index * HORIZONTAL_SPACING,
            y: level * VERTICAL_SPACING,
          },
          data: {
            type: block.type,
            title: block.title,
            body: block.body,
          },
        })
      })
    })

    // Create edges with teal arrows
    const flowEdges: Edge[] = []
    blocks.forEach((block) => {
      if (block.connects_to && block.connects_to.length > 0) {
        block.connects_to.forEach((targetId: string) => {
          flowEdges.push({
            id: `${block.id}-${targetId}`,
            source: block.id,
            target: targetId,
            type: 'default',
            animated: true,
            style: { stroke: '#49c6b9', strokeWidth: 2.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#49c6b9',
            },
          })
        })
      }
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [blocks, setNodes, setEdges])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e5e5e5" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
