import { useState } from 'react';
import Grid from './Grid';

function App() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [visited, setVisited] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMaze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/solve');
      const data = await response.json();
      setGrid(data.grid);
      setPath(data.path);
      setVisited(data.visited);
    } catch (error) {
      console.error("Error fetching maze:", error);
      alert("Make sure the backend is running at http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>A* Maze Solver</h1>
      <button 
        onClick={fetchMaze} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Solving...' : 'Run A*'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <Grid grid={grid} path={path} visited={visited} />
      </div>

      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'green' }}>■</span> Start</span>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'red' }}>■</span> Goal</span>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'black' }}>■</span> Wall</span>
        <span style={{ marginRight: '10px' }}><span style={{ color: 'lightblue' }}>■</span> Visited</span>
        <span><span style={{ color: 'yellow' }}>■</span> Path</span>
      </div>
    </div>
  );
}

export default App;
