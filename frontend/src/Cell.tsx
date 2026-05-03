import React from 'react';

interface CellProps {
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isStart: boolean;
  isGoal: boolean;
}

const Cell: React.FC<CellProps> = React.memo(({ isWall, isVisited, isPath, isStart, isGoal }) => {
  let className = "cell";
  
  if (isWall) className += " cell-wall";
  else if (isStart || isGoal) className += " cell-start-goal";
  else if (isPath) className += " cell-path";
  else if (isVisited) className += " cell-visited";

  return <div className={className} />;
});

export default Cell;
