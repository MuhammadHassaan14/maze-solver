import React from 'react';

interface CellProps {
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isStart: boolean;
  isGoal: boolean;
}

// React.memo ensures this component only re-renders if its primitive props change.
// In a grid of 400+ cells, this prevents hundreds of unnecessary re-renders per animation frame.
const Cell: React.FC<CellProps> = React.memo(({ isWall, isVisited, isPath, isStart, isGoal }) => {
  let backgroundColor = 'white';
  
  if (isWall) backgroundColor = 'black';
  else if (isStart || isGoal) backgroundColor = 'red';
  else if (isPath) backgroundColor = 'green';
  else if (isVisited) backgroundColor = 'blue';

  return (
    <div
      style={{
        width: '25px',
        height: '25px',
        backgroundColor,
        transition: 'background-color 0.1s ease', // Smooth color transition
      }}
    />
  );
});

export default Cell;
