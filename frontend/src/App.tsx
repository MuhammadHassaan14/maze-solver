import { useState, useEffect, useRef } from 'react';
import Grid from './Grid';

type Coord = [number, number];

function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [fullVisited, setFullVisited] = useState<Coord[]>([]);
  const [fullPath, setFullPath] = useState<Coord[]>([]);
  
  const [animatedVisited, setAnimatedVisited] = useState<Coord[]>([]);
  const [animatedPath, setAnimatedPath] = useState<Coord[]>([]);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(20); // Default Medium (20ms)
  const animationRef = useRef<number | null>(null);

  const stopAnimation = () => {
    if (animationRef.current) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  };

  const fetchNewMaze = async () => {
    stopAnimation();
    setAnimatedVisited([]);
    setAnimatedPath([]);

    try {
      const response = await fetch('http://localhost:5000/solve');
      if (!response.ok) throw new Error("Failed to fetch");
      
      const data = await response.json();
      setGrid(data.grid || []);
      setFullVisited(data.visited || []);
      setFullPath(data.path || []);
    } catch (error) {
      console.error("Error fetching maze:", error);
      alert("Error: Ensure the backend is running at http://localhost:5000");
    }
  };

  const handleStart = () => {
    if (fullVisited.length === 0 || isAnimating) return;
    
    // Reset animation states if we're starting over on same grid
    setAnimatedVisited([]);
    setAnimatedPath([]);
    setIsAnimating(true);
    
    let visitedIdx = 0;
    let pathIdx = 0;

    const interval = window.setInterval(() => {
      if (visitedIdx < fullVisited.length) {
        const nextNode = fullVisited[visitedIdx];
        if (nextNode) setAnimatedVisited((prev) => [...prev, nextNode]);
        visitedIdx++;
      } else if (pathIdx < fullPath.length) {
        const nextPathNode = fullPath[pathIdx];
        if (nextPathNode) setAnimatedPath((prev) => [...prev, nextPathNode]);
        pathIdx++;
      } else {
        stopAnimation();
      }
    }, speed);

    animationRef.current = interval;
  };

  // Fetch initial maze on load
  useEffect(() => {
    fetchNewMaze();
    return () => stopAnimation();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>A* Maze Solver</h1>
      
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px'
      }}>
        <button 
          onClick={fetchNewMaze} 
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          New Maze
        </button>

        <button 
          onClick={handleStart} 
          disabled={isAnimating || fullVisited.length === 0}
          style={{ 
            padding: '8px 16px', 
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            backgroundColor: isAnimating ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {isAnimating ? 'Animating...' : 'Start Visualization'}
        </button>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <label htmlFor="speed-select">Speed:</label>
          <select 
            id="speed-select"
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isAnimating}
            style={{ padding: '5px' }}
          >
            <option value={50}>Slow (50ms)</option>
            <option value={20}>Medium (20ms)</option>
            <option value={5}>Fast (5ms)</option>
          </select>
        </div>
      </div>
      
      <Grid grid={grid} path={animatedPath} visited={animatedVisited} />

      <div style={{ marginTop: '20px', fontSize: '14px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <span><span style={{ color: 'red' }}>■</span> Start/Goal</span>
        <span><span style={{ color: 'black' }}>■</span> Wall</span>
        <span><span style={{ color: 'blue' }}>■</span> Visited</span>
        <span><span style={{ color: 'green' }}>■</span> Path</span>
      </div>
    </div>
  );
}

export default App;
