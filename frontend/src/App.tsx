import { useState, useEffect, useRef } from 'react';
import Grid from './Grid';
import BackgroundGrid from './BackgroundGrid';

type Coord = [number, number];

function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [fullVisited, setFullVisited] = useState<Coord[]>([]);
  const [fullPath, setFullPath] = useState<Coord[]>([]);
  
  const [animatedVisited, setAnimatedVisited] = useState<Set<string>>(new Set());
  const [animatedPath, setAnimatedPath] = useState<Set<string>>(new Set());
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(20);
  const animationRef = useRef<number | null>(null);

  // Dark Mode State with System Preference check
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync theme class with body to ensure entire page background changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const stopAnimation = () => {
    if (animationRef.current) {
      window.clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  };

  const fetchNewMaze = async () => {
    stopAnimation();
    setAnimatedVisited(new Set());
    setAnimatedPath(new Set());

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
    
    setAnimatedVisited(new Set());
    setAnimatedPath(new Set());
    setIsAnimating(true);
    
    let visitedIdx = 0;
    let pathIdx = 0;

    const interval = window.setInterval(() => {
      if (visitedIdx < fullVisited.length) {
        const nextNode = fullVisited[visitedIdx];
        if (nextNode) {
          const key = `${nextNode[0]},${nextNode[1]}`;
          setAnimatedVisited((prev) => {
            const nextSet = new Set(prev);
            nextSet.add(key);
            return nextSet;
          });
        }
        visitedIdx++;
      } else if (pathIdx < fullPath.length) {
        const nextPathNode = fullPath[pathIdx];
        if (nextPathNode) {
          const key = `${nextPathNode[0]},${nextPathNode[1]}`;
          setAnimatedPath((prev) => {
            const nextSet = new Set(prev);
            nextSet.add(key);
            return nextSet;
          });
        }
        pathIdx++;
      } else {
        stopAnimation();
      }
    }, speed);

    animationRef.current = interval;
  };

  useEffect(() => {
    fetchNewMaze();
    return () => stopAnimation();
  }, []);

  return (
    <div className="app-container">
      <BackgroundGrid speed={speed} />
      <h1>A* Maze Solver</h1>
      
      <div className="control-panel">
        <button className="button btn-secondary" onClick={fetchNewMaze}>
          New Maze
        </button>

        <button 
          className="button btn-primary"
          onClick={handleStart} 
          disabled={isAnimating || fullVisited.length === 0}
        >
          {isAnimating ? 'Animating...' : 'Start Visualization'}
        </button>

        <div className="select-wrapper">
          <label htmlFor="speed-select">Speed:</label>
          <select 
            id="speed-select"
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isAnimating}
          >
            <option value={120}>Slow</option>
            <option value={40}>Medium</option>
            <option value={5}>Fast</option>
          </select>
        </div>

        <button 
          className="button btn-secondary" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      
      <div className="grid-wrapper">
        <Grid grid={grid} pathSet={animatedPath} visitedSet={animatedVisited} />
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-box box-start-goal"></div>
          <span>Start/Goal</span>
        </div>
        <div className="legend-item">
          <div className="legend-box box-wall"></div>
          <span>Wall</span>
        </div>
        <div className="legend-item">
          <div className="legend-box box-visited"></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-box box-path"></div>
          <span>Optimal Path</span>
        </div>
      </div>
    </div>
  );
}

export default App;
