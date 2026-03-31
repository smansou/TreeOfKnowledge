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
import {
  Folder,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  Play,
  Headphones,
  BookOpen,
} from "lucide-react";
import { useMemo, useEffect, useState, useCallback } from "react";

import { Category } from "@/types/category";
import { KnowledgeItem } from "@/types/knowledge";

import { BaseHandle } from "./base-handle";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "./base-node";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Separator } from "./ui/separator";

import "@xyflow/react/dist/style.css";

// Dagre graph setup
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 280; // Increased for list content
const nodeHeight = 120; // Base height, will vary

// Interface for expanded nodes tracking
interface ExpandedNodes {
  [key: string]: boolean;
}

// Interface for expanded knowledge items
interface ExpandedItems {
  [key: string]: boolean;
}

// Helper function to get content type icon and color
const getContentTypeDetails = (contentType: string) => {
  switch (contentType) {
    case "video":
      return { icon: Play, color: "#DC2626", label: "Video" };
    case "podcast":
      return { icon: Headphones, color: "#7C3AED", label: "Podcast" };
    case "book":
      return { icon: BookOpen, color: "#059669", label: "Book" };
    default:
      return { icon: FileText, color: "#3B82F6", label: "Article" };
  }
};

// Component for rendering knowledge item in list
const KnowledgeItemListItem = ({
  item,
  isExpanded,
  onToggle,
}: {
  item: KnowledgeItem;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const contentDetails = getContentTypeDetails(item.contentType);
  const IconComponent = contentDetails.icon;

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="mb-2 rounded-lg border bg-white p-3">
        <CollapsibleTrigger asChild>
          <div className="flex cursor-pointer items-center justify-between rounded p-1 hover:bg-gray-50">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <IconComponent
                className="h-4 w-4 flex-shrink-0"
                style={{ color: contentDetails.color }}
              />
              <span className="truncate text-sm font-medium">{item.title}</span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <ChevronRight
                className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="pt-2">
          <Separator className="mb-3" />
          {item.summary && (
            <p className="mb-2 text-xs leading-relaxed text-gray-600">
              {item.summary}
            </p>
          )}

          {/* Duration/Read Time */}
          {(item.metadata?.readTime || item.metadata?.duration) && (
            <div className="mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {item.metadata?.readTime
                    ? `${item.metadata.readTime} min read`
                    : ""}
                  {item.metadata?.duration
                    ? `${item.metadata.duration} min duration`
                    : ""}
                </span>
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mb-2">
              <div className="mb-1 text-xs text-gray-500">Tags:</div>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {item.sourceUrl && (
            <div className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
              <ExternalLink className="h-3 w-3" />
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:underline"
              >
                View Source
              </a>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// Custom node component for categories with differentiated rendering
const CategoryNode = ({
  data,
}: {
  data: Category & {
    isExpanded?: boolean;
    hasChildren?: boolean;
    hasItems?: boolean;
    items?: KnowledgeItem[];
    renderMode?: "standard" | "list" | "mixed";
    onToggle?: () => void;
    expandedItems?: ExpandedItems;
    onItemToggle?: (itemId: string) => void;
  };
}) => {
  const {
    isExpanded,
    hasChildren,
    hasItems,
    items = [],
    renderMode = "standard",
    onToggle,
    expandedItems = {},
    onItemToggle,
  } = data;

  // For list mode (category with only items) or mixed mode
  if (renderMode === "list" || (renderMode === "mixed" && hasItems)) {
    return (
      <BaseNode className="max-w-[280px] min-w-[260px]">
        <BaseNodeHeader>
          <BaseNodeHeaderTitle className="flex items-center gap-2">
            <Folder
              className="h-4 w-4"
              style={{ color: data.color || "#3B82F6" }}
            />
            <span className="truncate">{data.name}</span>
            {hasChildren && renderMode === "mixed" && (
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

        <BaseNodeContent className="pt-1">
          {data.description && (
            <p className="text-muted-foreground mb-2 text-xs leading-relaxed">
              {data.description}
            </p>
          )}

          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <FileText className="mr-1 h-3 w-3" />
              {items.length} items
            </Badge>
            {hasChildren && (
              <Badge variant="outline" className="text-xs">
                {data.children && Array.isArray(data.children)
                  ? data.children.length
                  : 0}{" "}
                subcategories
              </Badge>
            )}
          </div>

          {/* Render items list */}
          {items.length > 0 && (
            <div className="max-h-64 overflow-y-auto">
              {items.map((item) => (
                <KnowledgeItemListItem
                  key={item.id}
                  item={item}
                  isExpanded={expandedItems[item.id] || false}
                  onToggle={() => onItemToggle?.(item.id)}
                />
              ))}
            </div>
          )}
        </BaseNodeContent>

        {/* Handles for connections */}
        <BaseHandle
          type="target"
          position={Position.Left}
          className="!left-0 !translate-x-[-50%]"
        />
        {hasChildren && renderMode === "mixed" && (
          <BaseHandle
            type="source"
            position={Position.Right}
            className="!right-0 !translate-x-[50%]"
          />
        )}
      </BaseNode>
    );
  }

  // Standard mode (category with only subcategories or empty)
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
              {data.children && Array.isArray(data.children)
                ? data.children.length
                : 0}{" "}
              subcategories
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
  dagreGraph.setGraph({ rankdir: direction, nodesep: 60, ranksep: 180 });

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

  // Add nodes to dagre graph with dynamic sizing
  nodes.forEach((node) => {
    const width =
      node.data.renderMode === "list" || node.data.renderMode === "mixed"
        ? 280
        : nodeWidth;
    const baseHeight =
      node.data.renderMode === "list" || node.data.renderMode === "mixed"
        ? 200
        : nodeHeight;
    const itemCount =
      node.data.items && Array.isArray(node.data.items)
        ? node.data.items.length
        : 0;
    const height =
      node.data.renderMode === "list" || node.data.renderMode === "mixed"
        ? Math.max(baseHeight, baseHeight + itemCount * 60) // Dynamic height based on items
        : baseHeight;

    dagreGraph.setNode(node.id, { width, height });
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
    const width =
      node.data.renderMode === "list" || node.data.renderMode === "mixed"
        ? 280
        : nodeWidth;
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      // Shift dagre node position (center) to top-left for React Flow
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
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
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});
  const [shouldFitView, setShouldFitView] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);

  // Function to toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
    setShouldFitView(true);
  }, []);

  // Function to toggle item expansion
  const toggleItem = useCallback((itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // Fetch knowledge items
  useEffect(() => {
    const fetchKnowledgeItems = async () => {
      try {
        const response = await fetch("/api/knowledge?limit=100");
        const result = await response.json();

        if (result.data) {
          setKnowledgeItems(result.data);
        }
      } catch (err) {
        console.error("Error fetching knowledge items:", err);
      }
    };

    fetchKnowledgeItems();
  }, []);

  // Generate initial nodes and edges with differentiated rendering
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const processCategory = (category: Category, level: number = 0): void => {
      const hasChildren = category.children && category.children.length > 0;
      const categoryKnowledgeItems = knowledgeItems.filter((item) =>
        item.categories?.includes(category.id)
      );
      const hasItems = categoryKnowledgeItems.length > 0;
      const isExpanded = expandedNodes[category.id] ?? true;

      // Determine render mode
      let renderMode: "standard" | "list" | "mixed" = "standard";
      if (hasItems && !hasChildren) {
        renderMode = "list"; // Only items
      } else if (hasItems && hasChildren) {
        renderMode = "mixed"; // Both items and children
      }
      // hasChildren && !hasItems remains 'standard'

      // Create category node
      nodes.push({
        id: category.id,
        type: "category",
        position: { x: 0, y: 0 }, // Will be set by dagre
        data: {
          ...category,
          isExpanded,
          hasChildren,
          hasItems,
          items: categoryKnowledgeItems,
          renderMode,
          onToggle: () => toggleNode(category.id),
          expandedItems,
          onItemToggle: toggleItem,
        } as unknown as Record<string, unknown>,
        draggable: false,
      });

      // Process children only if expanded and in standard or mixed mode
      if (
        isExpanded &&
        hasChildren &&
        (renderMode === "standard" || renderMode === "mixed") &&
        category.children
      ) {
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
  }, [
    categories,
    expandedNodes,
    expandedItems,
    knowledgeItems,
    toggleNode,
    toggleItem,
  ]);

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
    const padding = 100;

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

  // Ensure this only renders on client side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);
    if (categories.length > 0) {
      setShouldFitView(true);
    }
  }, [categories.length]);

  // Fit view only when explicitly requested
  useEffect(() => {
    if (isClient && shouldFitView && nodes.length > 0) {
      requestAnimationFrame(() => {
        fitView({
          padding: 0.1,
          duration: 300,
          minZoom: 0.3,
          maxZoom: 1.2,
        });
        setShouldFitView(false);
      });
    }
  }, [shouldFitView, isClient, nodes.length, fitView]);

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
          minZoom: 0.3,
          maxZoom: 1.2,
        }}
      >
        <Background color="#e2e8f0" gap={20} size={1} />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
