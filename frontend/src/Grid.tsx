import React, { useMemo } from 'react';

interface GridProps {
  grid: number[][];
  path: [number, number][];
  visited: [number, number][];
}

const Grid: React.FC<GridProps> = ({ grid = [], path = [], visited = [] }) => {
  if (!grid || grid.length === 0) return <div>No maze generated yet.</div>;

  const rows = grid.length;
  const cols = grid[0].length;

  // Optimize lookups with Sets and safety checks for elements
  const pathSet = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(path)) {
      path.forEach((p) => {
        if (p && p.length === 2) set.add(`${p[0]},${p[1]}`);
      });
    }
    return set;
  }, [path]);

  const visitedSet = useMemo(() => {
    const set = new Set<string>();
    if (Array.isArray(visited)) {
      visited.forEach((v) => {
        if (v && v.length === 2) set.add(`${v[0]},${v[1]}`);
      });
    }
    return set;
  }, [visited]);

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
          const isStartOrGoal = (r === 0 && c === 0) || (r === rows - 1 && c === cols - 1);
          
          let backgroundColor = 'white';
          if (cell === 1) backgroundColor = 'black';
          else if (isStartOrGoal) backgroundColor = 'red';
          else if (pathSet.has(coordKey)) backgroundColor = 'green';
          else if (visitedSet.has(coordKey)) backgroundColor = 'blue';

          return (
            <div
              key={coordKey}
              style={{
                width: '25px',
                height: '25px',
                backgroundColor,
              }}
            />
          );
        })
      )}
    </div>
  );
};

export default Grid;
