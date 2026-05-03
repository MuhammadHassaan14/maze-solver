import { useState, useEffect, useRef } from 'react';
import Grid from './Grid';

type Coord = [number, number];

function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [animatedVisited, setAnimatedVisited] = useState<Coord[]>([]);
  const [animatedPath, setAnimatedPath] = useState<Coord[]>([]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  const fetchMaze = async () => {
    // Clear any existing animation
    if (animationRef.current) {
      window.clearInterval(animationRef.current);
    }
    
    // Reset state for new run
    setAnimatedVisited([]);
    setAnimatedPath([]);
    setIsAnimating(true);

    try {
      const response = await fetch('http://localhost:5000/solve');
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      
      // Ensure data is valid before starting
      const gridData = data.grid || [];
      const visitedData = data.visited || [];
      const pathData = data.path || [];
      
      setGrid(gridData);
      
      if (visitedData.length > 0) {
        startAnimation(visitedData, pathData);
      } else {
        setIsAnimating(false);
      }
    } catch (error) {
      console.error("Error fetching maze:", error);
      alert("Error: Ensure the backend is running at http://localhost:5000");
      setIsAnimating(false);
    }
  };

  const startAnimation = (visited: Coord[], path: Coord[]) => {
    let visitedIdx = 0;
    let pathIdx = 0;

    const interval = window.setInterval(() => {
      if (visitedIdx < visited.length) {
        const nextNode = visited[visitedIdx];
        if (nextNode) {
          setAnimatedVisited((prev) => [...prev, nextNode]);
        }
        visitedIdx++;
      } else if (pathIdx < path.length) {
        const nextPathNode = path[pathIdx];
        if (nextPathNode) {
          setAnimatedPath((prev) => [...prev, nextPathNode]);
        }
        pathIdx++;
      } else {
        window.clearInterval(interval);
        setIsAnimating(false);
      }
    }, 20);

    animationRef.current = interval;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) window.clearInterval(animationRef.current);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>A* Maze Solver</h1>
      <button 
        onClick={fetchMaze} 
        disabled={isAnimating}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {isAnimating ? 'Animating...' : 'Run A*'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <Grid grid={grid} path={animatedPath} visited={animatedVisited} />
      </div>

      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'red' }}>■</span> Start/Goal</span>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'black' }}>■</span> Wall</span>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'blue' }}>■</span> Visited</span>
        <span><span style={{ color: 'green' }}>■</span> Path</span>
      </div>
    </div>
  );
}

export default App;
