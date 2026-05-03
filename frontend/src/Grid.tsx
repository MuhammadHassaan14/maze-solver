import React from 'react';
import Cell from './Cell';

interface GridProps {
  grid: number[][];
  pathSet: Set<string>;
  visitedSet: Set<string>;
}

const Grid: React.FC<GridProps> = ({ grid = [], pathSet, visitedSet }) => {
  if (!grid || grid.length === 0) return <div>No maze generated yet.</div>;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 25px)`,
        gridAutoRows: '25px',
        gap: '1px',
        backgroundColor: '#333',
        border: '2px solid #333',
        width: 'fit-content',
        margin: '20px auto',
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
