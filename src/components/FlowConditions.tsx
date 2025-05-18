import React, { useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";

const FlowConditions = ({ apiResponse }) => {
  // Parse vectordb results
  const matches = [...(apiResponse?.analysis?.vectordb_results?.matchAll(
    /([^,]+(?:\([^)]*\))?)\s*,"([^"]+)","([^"]+)"/g
  ) || [])];

  // Generate nodes and edges
  const nodes = [];
  const edges = [];
  let id = 1;
  
  // Add user input node (centered at top)
  const userInputId = "user-input";
  nodes.push({
    id: userInputId,
    data: { label: "User Input" },
    position: { x: 400, y: 0 },
    style: { width: 150 },
    className: 'bg-[#bbdefb] rounded-xl p-2 shadow-md font-semibold'
  });

  // Add initial diagnosis node
  const initialDiagnosisId = "initial-diagnosis";
  if (apiResponse?.analysis?.initial_diagnosis) {
    nodes.push({
      id: initialDiagnosisId,
      data: { label: apiResponse.analysis.initial_diagnosis },
      position: { x: 400, y: 100 },
      style: { width: 350 },
      className: 'bg-[#dcedc8] rounded-xl p-2 shadow-md'
    });

    // Connect user input to initial diagnosis
    edges.push({
      id: `e-init-${id++}`,
      source: userInputId,
      target: initialDiagnosisId,
      animated: true,
      label: "Analysis",
      style: { stroke: '#4caf50' }
    });
  }

  // Add VectorDB header node if we have matches
  const vectorDbHeaderId = "vectordb-header";
  if (matches.length > 0) {
    nodes.push({
      id: vectorDbHeaderId,
      data: { label: "Similar Conditions (VectorDB Results)" },
      position: { x: 400, y: 200 },
      style: { width: 300 },
      className: 'bg-[#d1c4e9] rounded-xl p-2 shadow-md font-semibold'
    });

    // Connect initial diagnosis to vectordb header
    if (apiResponse?.analysis?.initial_diagnosis) {
      edges.push({
        id: `e-vec-${id++}`,
        source: initialDiagnosisId,
        target: vectorDbHeaderId,
        animated: true,
        style: { stroke: '#7e57c2' }
      });
    } else {
      // If no initial diagnosis, connect user input directly to vectordb header
      edges.push({
        id: `e-vec-${id++}`,
        source: userInputId,
        target: vectorDbHeaderId,
        animated: true,
        style: { stroke: '#7e57c2' }
      });
    }
  }

  // Position for vectordb results - changed to horizontal arrangement of condition groups
  let x = 0;
  const xOffset = 250; // horizontal spacing between condition columns
  const startY = 300; // starting Y position for conditions
  
  // Add condition nodes from vectordb results - changed to vertical arrangement
  matches.forEach((match, i) => {
    const [condition, symptoms, treatment] = [match[1], match[2], match[3]];

    const condId = `cond-${i}`;
    const symId = `sym-${i}`;
    const treatId = `treat-${i}`;

    // Position nodes vertically for each condition group
    nodes.push(
      { 
        id: condId, 
        data: { label: condition }, 
        position: { x: x + xOffset/2, y: startY }, 
        style: { width: 200 }, 
        className: 'bg-[#e0f7fa] rounded-xl p-2 shadow-md' 
      },
      { 
        id: symId, 
        data: { label: symptoms }, 
        position: { x: x + xOffset/2, y: startY + 100 }, 
        style: { width: 200 }, 
        className: 'bg-[#fce4ec] rounded-xl p-2 shadow-md' 
      },
      { 
        id: treatId, 
        data: { label: treatment }, 
        position: { x: x + xOffset/2, y: startY + 200 }, 
        style: { width: 200 }, 
        className: 'bg-[#fff3e0] rounded-xl p-2 shadow-md' 
      }
    );

    // Connect nodes vertically within each condition group
    edges.push(
      { id: `e${id++}`, source: condId, target: symId, animated: true, style: { stroke: '#62d5d0' } },
      { id: `e${id++}`, source: symId, target: treatId, animated: true, style: { stroke: '#62d5d0' } }
    );

    // Connect vectordb header to each condition
    if (matches.length > 0) {
      edges.push({
        id: `e-cond-${id++}`,
        source: vectorDbHeaderId,
        target: condId,
        animated: true,
        style: { stroke: '#7e57c2' }
      });
    }

    x += xOffset; // Move to next horizontal position for the next condition group
  });

  // Add final analysis node at the bottom
  const finalAnalysisId = "final-analysis";
  if (apiResponse?.analysis?.final_analysis) {
    nodes.push({
      id: finalAnalysisId,
      data: { label: apiResponse.analysis.final_analysis },
      position: { x: 400, y: startY + 350 },
      style: { width: 500 },
      className: 'bg-[#ffecb3] rounded-xl p-3 shadow-md border-2 border-[#ffca28]'
    });

    // Connect vectordb header to final analysis if we have vectordb results
    if (matches.length > 0) {
      edges.push({
        id: `e-final-${id++}`,
        source: vectorDbHeaderId,
        target: finalAnalysisId,
        animated: true,
        label: "Synthesized",
        style: { stroke: '#ffa000' }
      });
    } else if (apiResponse?.analysis?.initial_diagnosis) {
      // If no vectordb results but we have initial diagnosis, connect it to final analysis
      edges.push({
        id: `e-final-${id++}`,
        source: initialDiagnosisId,
        target: finalAnalysisId,
        animated: true,
        label: "Synthesized",
        style: { stroke: '#ffa000' }
      });
    } else{
      // If neither, connect user input directly to final analysis
      edges.push({
        id: `e-final-${id++}`,
        source: userInputId,
        target: finalAnalysisId,
        animated: true,
        label: "Synthesized",
        style: { stroke: '#ffa000' }
      });
    }
  }

  const [nodeState, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgeState, setEdges, onEdgesChange] = useEdgesState(edges);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Calculate height based on content - adjusted for vertical layout
  const contentHeight = 800;
  // Calculate width based on number of matches
  const contentWidth = Math.max(1000, matches.length * xOffset + 100);

  return (
    <div style={{ height: `${contentHeight}px`, width: "100%" }} className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-200">
      {nodes.length > 0 ? (
        <ReactFlow
          nodes={nodeState}
          edges={edgeState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ width: "100%" }}
          className="w-full"
        >
          <MiniMap />
          <Controls />
          <Background 
            gap={12} 
            size={1} 
            color="#718096" 
            className="bg-background "
          />
        </ReactFlow>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-50 rounded-xl border border-gray-200 dark:border-gray-200">
          <p className="text-gray-500 dark:text-gray-400">No data available to visualize</p>
        </div>
      )}
    </div>
  );
};

export default FlowConditions;