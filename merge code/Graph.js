import React, { useState } from 'react';
import Graph from 'react-graph-vis';
import './CustomGraph.css'; // Import the CSS file

const CustomGraph = ({ data }) => {
  const uniqueNodes = {};
  const graphNodes = [];
  const graphEdges = [];
  const uniqueEdges = {}; 

  // Process data to create unique nodes and edges
  data.cars.forEach((car, index) => {
    const senderID = car.Record.SenderID;
    const receiverID = car.Record.ReceiverID;

    if (!uniqueNodes[senderID]) {
      uniqueNodes[senderID] = true;
      graphNodes.push({
        id: `node-${senderID}`,
        label: senderID,
        color: '#cb8782',
        shape: 'box',
        data: car.Record,
      });
    }

    if (!uniqueNodes[receiverID]) {
      uniqueNodes[receiverID] = true;
      graphNodes.push({
        id: `node-${receiverID}`,
        label: receiverID,
        color: '#cb8782',
        shape: 'box',
        data: car.Record,
      });
    }

    const edgeKey = `edge-${senderID}-${receiverID}`;
    if (!uniqueEdges[edgeKey]) {
      uniqueEdges[edgeKey] = true;
      graphEdges.push({
        id: edgeKey,
        from: `node-${senderID}`,
        to: `node-${receiverID}`,
        label: car.Record.status,
        smooth: {
          enabled: true,
        },
        color: '#Be3a25',
      });
    }
  });

  const graph = {
    nodes: graphNodes,
    edges: graphEdges,
  };

  const options = {
    nodes: {
      chosen: {
        borderColor: 'EAC215',
      },
    },
    layout: {
      hierarchical: true,
    },
    edges: {
      color: '#000000',
    },
    height: '700px',
    interaction: {
      navigationButtons: true,
      keyboard: false,
      zoomView: false,
    },
    physics: {
      enabled: false,
    },
  };

  const [selectedNodeData, setSelectedNodeData] = useState(null);

  const events = {
    selectNode: function (event) {
      const selectedNodeId = event.nodes[0];
      const selectedNode = graphNodes.find((node) => node.id === selectedNodeId);
      if (selectedNode) {
        setSelectedNodeData(selectedNode.data);
      }
    },
  };

  return (
    <div>
      <Graph graph={graph} options={options} events={events} />
      {selectedNodeData && (
        <div className="details-panel">
          <h3>Selected Node Data:</h3>
          <p>SenderID: {selectedNodeData.SenderID}</p>
          <p>Location: {selectedNodeData.Location}</p>
          <p>AnimalType: {selectedNodeData.AnimalType}</p>
          <p>Quantity: {selectedNodeData.Quantity}</p>
        </div>
      )}
    </div>
  );
};

export default CustomGraph;
