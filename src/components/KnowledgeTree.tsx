"use client";

import dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  Position,
  NodeTypes,
  useReactFlow,
  useNodesState,
  useEdgesState,
  getNodesBounds,
} from "@xyflow/react";
import { Folder, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useEffect, useState, useCallback } from "react";

import { Category } from "@/types/category";

import { BaseHandle } from "./base-handle";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "./base-node";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

import "@xyflow/react/dist/style.css";

// Dagre graph setup
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const nodeHeight = 100;

// Interface for expanded nodes tracking
interface ExpandedNodes {
  [key: string]: boolean;
}

// Custom node component for categories with expand/collapse functionality
const CategoryNode = ({
  data,
}: {
  data: Category & {
    isExpanded?: boolean;
    hasChildren?: boolean;
    onToggle?: () => void;
  };
}) => {
  const { isExpanded, hasChildren, onToggle } = data;

  return (
    <BaseNode className="max-w-[220px] min-w-[200px]">
      <BaseNodeHeader>
        <BaseNodeHeaderTitle className="flex items-center gap-2">
          <Folder
            className="h-4 w-4"
            style={{ color: data.color || "#3B82F6" }}
          />
          <span className="truncate">{data.name}</span>
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
        </BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent className="pt-0">
        {data.description && (
          <p className="text-muted-foreground truncate text-xs">
            {data.description}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <FileText className="mr-1 h-3 w-3" />
            {data.itemCount || 0} items
          </Badge>
          {hasChildren && (
            <Badge variant="outline" className="text-xs">
              {data.children?.length || 0} subcategories
            </Badge>
          )}
        </div>
      </BaseNodeContent>

      {/* Handles for connections */}
      <BaseHandle
        type="target"
        position={Position.Left}
        className="!left-0 !translate-x-[-50%]"
      />
      <BaseHandle
        type="source"
        position={Position.Right}
        className="!right-0 !translate-x-[50%]"
      />
    </BaseNode>
  );
};

// Node types mapping
const nodeTypes: NodeTypes = {
  category: CategoryNode,
};

// Function to get layouted elements using dagre
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "LR"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 150 });

  // Clear previous graph
  nodes.forEach((node) => {
    if (dagreGraph.hasNode(node.id)) {
      dagreGraph.removeNode(node.id);
    }
  });

  edges.forEach((edge) => {
    if (dagreGraph.hasEdge(edge.source, edge.target)) {
      dagreGraph.removeEdge(edge.source, edge.target);
    }
  });

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run dagre layout
  dagre.layout(dagreGraph);

  // Apply positions to nodes
  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // Shift dagre node position (center) to top-left for React Flow
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

interface KnowledgeTreeProps {
  categories: Category[];
  className?: string;
}

export function KnowledgeTree({ categories, className }: KnowledgeTreeProps) {
  const { fitView } = useReactFlow();
  const [isClient, setIsClient] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});

  // Function to toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  }, []);

  // Generate initial nodes and edges with expansion state
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const processCategory = (category: Category, level: number = 0): void => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedNodes[category.id] ?? true; // Default to expanded

      // Create node
      nodes.push({
        id: category.id,
        type: "category",
        position: { x: 0, y: 0 }, // Will be set by dagre
        data: {
          ...category,
          isExpanded,
          hasChildren,
          onToggle: () => toggleNode(category.id),
        } as unknown as Record<string, unknown>,
        draggable: false,
      });

      // Process children only if expanded
      if (hasChildren && isExpanded && category.children) {
        category.children.forEach((child) => {
          // Create edge from parent to child
          edges.push({
            id: `${category.id}-${child.id}`,
            source: category.id,
            target: child.id,
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          });

          // Recursively process child
          processCategory(child, level + 1);
        });
      }
    };

    // Process all root categories
    categories.forEach((category) => processCategory(category));

    return { initialNodes: nodes, initialEdges: edges };
  }, [categories, expandedNodes, toggleNode]);

  // Apply dagre layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (initialNodes.length === 0) {
      return { nodes: [], edges: [] };
    }
    return getLayoutedElements(initialNodes, initialEdges, "LR");
  }, [initialNodes, initialEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Calculate bounds for constraining the canvas
  const translateExtent = useMemo(() => {
    if (nodes.length === 0) {
      return [
        [-1000, -1000],
        [1000, 1000],
      ] as [[number, number], [number, number]];
    }

    const nodesBounds = getNodesBounds(nodes);
    const padding = 100; // Add some padding around the content

    return [
      [nodesBounds.x - padding, nodesBounds.y - padding],
      [
        nodesBounds.x + nodesBounds.width + padding,
        nodesBounds.y + nodesBounds.height + padding,
      ],
    ] as [[number, number], [number, number]];
  }, [nodes]);

  // Update nodes and edges when layout changes
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Fit view when nodes change
  useEffect(() => {
    if (isClient && nodes.length > 0) {
      // Use requestAnimationFrame to ensure nodes are rendered
      requestAnimationFrame(() => {
        fitView({
          padding: 0.1,
          duration: 300,
          minZoom: 0.5,
          maxZoom: 1.5,
        });
      });
    }
  }, [nodes, edges, fitView, isClient]);

  // Ensure this only renders on client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-50">
        <div className="text-sm text-gray-500">Loading tree...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg bg-gray-50">
        <div className="text-center">
          <Folder className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No Categories Yet
          </h3>
          <p className="text-sm text-gray-600">
            Create categories to start building your knowledge tree
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-96 w-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        preventScrolling={false}
        translateExtent={translateExtent}
        fitView
        fitViewOptions={{
          padding: 0.1,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
