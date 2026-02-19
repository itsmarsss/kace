import { useEffect } from 'react'
import dagre from 'dagre'
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
  Handle,
  Position,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getBlockStyle } from './blockTypes'
import { useMode } from '../../context/ModeProvider'
import BlockFeedback from './BlockFeedback'

// Custom node component for diagram blocks
function DiagramNode({ data }: { data: any }) {
  const { dispatch } = useMode()
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

  const handleMouseEnter = () => {
    dispatch({ type: 'SET_HOVERED_BLOCK', payload: data.block })
  }

  const handleMouseLeave = () => {
    dispatch({ type: 'SET_HOVERED_BLOCK', payload: null })
  }

  const handleDoubleClick = () => {
    dispatch({ type: 'SET_SELECTED_BLOCK', payload: data.block })
  }

  // Diff state styling
  const diffStateClass =
    data.diffState === 'match'
      ? 'ring-2 ring-[var(--green)]'
      : data.diffState === 'miss'
        ? 'opacity-60 border-dashed'
        : data.diffState === 'wrong'
          ? 'ring-2 ring-[var(--crimson)]'
          : ''

  return (
    <div
      className={`min-w-[280px] max-w-[350px] rounded-[var(--r)] border border-t-[3px] p-[12px_14px] shadow-[var(--shadow-md)] transition-all duration-150 hover:shadow-[var(--shadow-lg)] ${bgClass} ${borderClass} ${borderTopClass} ${diffStateClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {/* Connection handles for edges */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

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

      {/* Feedback */}
      {data.showFeedback && data.block?.feedback && <BlockFeedback feedback={data.block.feedback} />}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  diagramBlock: DiagramNode,
}

interface DiagramFlowProps {
  blocks: any[]
}

interface FlowContentProps {
  blocks: any[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
}

// Inner component that has access to ReactFlow context
function FlowContent({ blocks, setNodes, setEdges }: FlowContentProps) {
  const { fitView, getNodes, getEdges } = useReactFlow()

  // Convert blocks to React Flow nodes and edges using dagre layout
  useEffect(() => {
    if (blocks.length === 0) return

    // Create dagre graph for layout calculation
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({
      rankdir: 'TB', // Top to bottom
      nodesep: 120, // Horizontal spacing between nodes (increased for edge visibility)
      ranksep: 180, // Vertical spacing between ranks (increased for edge visibility)
      edgesep: 50, // Spacing between edges
      marginx: 50,
      marginy: 50,
      ranker: 'tight-tree' // Better for showing hierarchies with branches
    })

    // Create nodes without positions first
    const flowNodes: Node[] = blocks.map((block: any) => ({
      id: block.id,
      type: 'diagramBlock',
      position: { x: 0, y: 0 }, // Will be set by dagre
      data: {
        type: block.type,
        title: block.title,
        body: block.body,
        block: block, // Pass full block for hover/click handlers
        diffState: block.diffState, // Pass diff state for visual indicators
        showFeedback: block.showFeedback, // Pass whether to show feedback
      },
    }))

    // Add nodes to dagre graph with dimensions
    flowNodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 350, height: 150 })
    })

    // Add edges to dagre graph
    blocks.forEach((block: any) => {
      if (block.connects_to && block.connects_to.length > 0) {
        block.connects_to.forEach((targetId: string) => {
          dagreGraph.setEdge(block.id, targetId)
        })
      }
    })

    // Run dagre layout algorithm
    dagre.layout(dagreGraph)

    // Apply calculated positions to nodes
    flowNodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id)
      node.position = {
        x: nodeWithPosition.x - 175, // Center node (width/2)
        y: nodeWithPosition.y - 75, // Center node (height/2)
      }
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
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#49c6b9',
              strokeWidth: 3,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#49c6b9',
            },
          })
        })
      }
    })

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [blocks, setNodes, setEdges])

  // Auto-fit view whenever blocks change
  useEffect(() => {
    const currentNodes = getNodes()
    if (currentNodes.length > 0) {
      // Small delay to ensure nodes are rendered before fitting
      const timer = setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [blocks, getNodes, fitView])

  return (
    <>
      <Background color="#e5e5e5" gap={16} />
      <Controls />
    </>
  )
}

// Outer wrapper component
export default function DiagramFlow({ blocks }: DiagramFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { strokeWidth: 3, stroke: '#49c6b9' },
        }}
        elevateEdgesOnSelect={false}
        proOptions={{ hideAttribution: true }}
      >
        <FlowContent blocks={blocks} setNodes={setNodes} setEdges={setEdges} />
      </ReactFlow>
    </div>
  )
}
