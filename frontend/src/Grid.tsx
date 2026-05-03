import React from 'react';

interface GridProps {
  grid: number[][];
  path: [number, number][];
  visited: [number, number][];
}

const Grid: React.FC<GridProps> = ({ grid, path, visited }) => {
  if (grid.length === 0) return <div>No maze generated yet.</div>;

  const rows = grid.length;
  const cols = grid[0].length;

  // Helper to check if a cell is in a list of coordinates
  const isIncluded = (coords: [number, number][], r: number, c: number) => {
    return coords.some(([row, col]) => row === r && col === c);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 20px)`,
        gap: '1px',
        backgroundColor: '#ccc',
        border: '1px solid #999',
        width: 'fit-content',
        margin: '20px auto',
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          let backgroundColor = 'white';
          if (cell === 1) backgroundColor = 'black'; // Wall
          else if (isIncluded(path, r, c)) backgroundColor = 'yellow'; // Final Path
          else if (isIncluded(visited, r, c)) backgroundColor = 'lightblue'; // Explored

          // Start and Goal markers
          if (r === 0 && c === 0) backgroundColor = 'green';
          if (r === rows - 1 && c === cols - 1) backgroundColor = 'red';

          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: '20px',
                height: '20px',
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
