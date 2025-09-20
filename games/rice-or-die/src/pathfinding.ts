import { State } from './state.ts';

// TODO Use better game area limits.
const minX = 10;
const maxX = 41;
const minY = 1;
const maxY = 27;

type Position = { x: number; y: number };

// A* algorithm. See wikipedia for explanation
export const pathfind = (startPos: Position, goalPositions: Position[], state: State) => {
  const cameFrom: Record<string, Position> = {};
  const openSet = [startPos];
  const gScore = { [nodeKey(startPos)]: 0 };
  const fScore = { [nodeKey(startPos)]: calculateHeuristicCost(startPos, goalPositions) };
  while (openSet.length > 0) {
    openSet.sort((node1, node2) => fScore[nodeKey(node1)] - fScore[nodeKey(node2)]);
    const current = openSet[0];
    if (goalPositions.some((goalPosition) => nodeKey(goalPosition) === nodeKey(current))) {
      return reconstructPath(cameFrom, current);
    }
    // We sorted the array so remove the first element
    openSet.shift();
    for (const neighbor of getNeighbors(current)) {
      // Set initial gScore
      if (!(nodeKey(neighbor) in gScore)) {
        gScore[nodeKey(neighbor)] = Infinity;
      }
      const tentativeGScore =
        gScore[nodeKey(current)] + getNeighborEdgeCost(current, neighbor, state);
      if (tentativeGScore < gScore[nodeKey(neighbor)]) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[nodeKey(neighbor)] = current;
        gScore[nodeKey(neighbor)] = tentativeGScore;
        fScore[nodeKey(neighbor)] =
          tentativeGScore + calculateHeuristicCost(neighbor, goalPositions);
        if (!openSet.find((position) => nodeKey(position) === nodeKey(neighbor))) {
          openSet.push(neighbor);
        }
      }
    }
  }
  console.log("Couldn't find path start to goal:", startPos, goalPositions);
  return null;
};

const reconstructPath = (cameFrom: Record<string, Position>, goal: Position) => {
  let current = goal;
  const totalPath = [current];
  while (nodeKey(current) in cameFrom) {
    current = cameFrom[nodeKey(current)];
    totalPath.push(current);
  }
  return totalPath.reverse();
};

const getNeighborEdgeCost = (_current: Position, neighbor: Position, state: State) => {
  const hasTower = state.towers.find(
    (tower) => tower.gridX === neighbor.x && tower.gridY === neighbor.y,
  );
  // Towers are not walkable
  return hasTower ? Infinity : 1;
};

// Convert positions into string keys, so they can be used as object keys
const nodeKey = (position: Position) => {
  return `${position.x},${position.y}`;
};

const calculateHeuristicCost = (startPos: Position, goalPositions: Position[]) => {
  const goalDistances = goalPositions.map((goalPosition) => {
    return Math.abs(startPos.x - goalPosition.x) + Math.abs(startPos.y - goalPosition.y);
  });
  return Math.min(...goalDistances);
};

// Get neighboring tiles
const getNeighbors = (position: Position) => {
  const neighborCandidates = [
    { x: position.x + 1, y: position.y },
    { x: position.x - 1, y: position.y },
    { x: position.x, y: position.y + 1 },
    { x: position.x, y: position.y - 1 },
  ];
  // Check if x or y coordinates are inside of play area
  const isInsideOfArea = (pos: Position) =>
    !(pos.x < minX || pos.x > maxX || pos.y > maxY || pos.y < minY);
  const neighbors = neighborCandidates.filter(isInsideOfArea);
  return neighbors;
};
