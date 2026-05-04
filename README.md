# A* Maze Solver

A professional full-stack application that generates guaranteed-solvable mazes and visualizes the A* search algorithm in real-time.

## Features
- **Guaranteed Solvable:** Backend generates random mazes and validates path existence before serving.
- **A\* Visualization:** Watch the algorithm explore nodes and find the optimal path.
- **Performance Optimized:** Uses `Set` for O(1) lookups and `React.memo` for smooth 60FPS animations on 400+ cells.
- **Modern Dashboard:** Clean UI with speed controls and a responsive grid.

---

## Setup Instructions

### 1. Backend (Flask)
The backend handles maze generation and pathfinding logic.

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
The backend will be running at `http://localhost:5000`.

### 2. Frontend (React + Vite)
The frontend provides the interactive visualization.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
Open your browser and navigate to the URL provided (typically `http://localhost:5173`).

---

## Algorithm Explanation

The **A* (A-Star) Algorithm** is a heuristic search algorithm used to find the shortest path between nodes in a graph. It is widely used in pathfinding and graph traversal.

### Cost Function
A* selects the next node to explore based on the function:
$$f(n) = g(n) + h(n)$$

Where:
- **$g(n)$**: The actual cost from the start node to node $n$.
- **$h(n)$**: The heuristic estimate of the cost from node $n$ to the goal.
- **$f(n)$**: The total estimated cost of the cheapest solution through node $n$.

### Heuristic: Manhattan Distance
For this project, we use **Manhattan Distance** as the heuristic $h(n)$. 
$$h(n) = |x_{goal} - x_n| + |y_{goal} - y_n|$$

**Why Manhattan Distance?**
In a 4-way grid (Up, Down, Left, Right movement only), Manhattan Distance is the **perfect admissible heuristic**. 
- **Admissibility:** It never overestimates the cost to reach the goal, ensuring that A* always finds the optimal (shortest) path.
- **Efficiency:** Since we cannot move diagonally, the "L-shaped" distance is the most accurate reflection of the minimum number of steps required to reach the target.
