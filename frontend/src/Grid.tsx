import React from 'react';
import Cell from './Cell';

interface GridProps {
  grid: number[][];
  pathSet: Set<string>;
  visitedSet: Set<string>;
}

const Grid: React.FC<GridProps> = ({ grid = [], pathSet, visitedSet }) => {
  if (!grid || grid.length === 0) return <div className="loading">Generating maze...</div>;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, var(--cell-size))`,
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const coordKey = `${r},${c}`;
          return (
            <Cell
              key={coordKey}
              isWall={cell === 1}
              isStart={r === 0 && c === 0}
              isGoal={r === rows - 1 && c === cols - 1}
              isVisited={visitedSet.has(coordKey)}
              isPath={pathSet.has(coordKey)}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
